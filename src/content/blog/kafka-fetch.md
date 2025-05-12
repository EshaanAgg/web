---
title: "Consuming Messages | BYO Kafka"
description: All the concepts, and documentation you need to know to need to pass the "Consume Messages" test in the Build Your Own Kafka challenge.
pubDate: 2025-05-12
updatedDate: 2025-05-13
tags: ["kafka", "codecrafters", "2025"]
hero: "./images/byok.png"
heroAlt: "A deck of numbered cards from 1 to 5 and text 'Build Your Own Kafka' with CodeCrafter's logo"
draft: false
pinned: true
---

The [**Build Your Own Kafka**](https://app.codecrafters.io/courses/kafka/introduction) challenge on [CodeCrafters](https://codecrafters.io) is an advanced systems programming project where you're tasked with recreating key components of [Apache Kafka](http://kafka.apache.org/) — a high-throughput, distributed event streaming platform.

One of the most critical and intricate parts of this challenge is the **“Consuming Messages”** extension, which involves implementing the **Fetch API** — the mechanism through which consumers retrieve messages from Kafka topics.

This blog is my personal technical log — a resource I wished I had when I started. The Fetch API itself isn’t inherently complex, but the sparse documentation and scattered prerequisites can make it feel overwhelming. Instead of walking through implementation details (which vary by language and architecture), I aim to unpack the necessary concepts, protocol requirements, and Kafka-specific architecture that you need to confidently tackle this extension.

> I also make use of quotes like this to point out things specific to the CodeCrafters tester and environment. You can safely ignore them if you want to write a complete Kafka implementation, but they can be helpful for reducing the complexity of your implementation.

## The Fetch API

The Fetch API is the primary way for consumers to read messages from Kafka topics. It allows clients to request messages from a specific topic and partition, starting from a given offset.

The format for the `FetchRequest` and `FetchResponse` is defined in the [Kafka protocol documentation](https://kafka.apache.org/protocol.html). The extension makes use of the version 16 of the protocol for both of these requests. Also, the `FetchResponse` makes use of the `HeaderV1` format, which is different from the `HeaderV0` format used in the previous `APIVersions` response, so you need to handle that appropriately as well.

Here are the CNF grammar rules for the mentioned objects if you need them:

<details>
<summary> CNF Grammar Rules </summary>

```
HeaderV0 => correlationId
  correlationId => INT32
```

<br>

```
HeaderV1 => correlationId TAG_BUFFER
  correlationId => INT32
```

<br>

```
FetchRequestV16 => max_wait_ms min_bytes max_bytes isolation_level session_id session_epoch [topics] [forgotten_topics_data] rack_id _tagged_fields
  max_wait_ms => INT32
  min_bytes => INT32
  max_bytes => INT32
  isolation_level => INT8
  session_id => INT32
  session_epoch => INT32
  topics => topic_id [partitions] _tagged_fields
    topic_id => UUID
    partitions => partition current_leader_epoch fetch_offset last_fetched_epoch log_start_offset partition_max_bytes _tagged_fields
      partition => INT32
      current_leader_epoch => INT32
      fetch_offset => INT64
      last_fetched_epoch => INT32
      log_start_offset => INT64
      partition_max_bytes => INT32
  forgotten_topics_data => topic_id [partitions] _tagged_fields
    topic_id => UUID
    partitions => INT32
  rack_id => COMPACT_STRING
```

<br>

```
FetchResponseV16 => throttle_time_ms error_code session_id [responses] _tagged_fields
  throttle_time_ms => INT32
  error_code => INT16
  session_id => INT32
  responses => topic_id [partitions] _tagged_fields
    topic_id => UUID
    partitions => partition_index error_code high_watermark last_stable_offset log_start_offset [aborted_transactions] preferred_read_replica records _tagged_fields
      partition_index => INT32
      error_code => INT16
      high_watermark => INT64
      last_stable_offset => INT64
      log_start_offset => INT64
      aborted_transactions => producer_id first_offset _tagged_fields
        producer_id => INT64
        first_offset => INT64
      preferred_read_replica => INT32
      records => COMPACT_RECORDS
```

All the arrays used in the above rules are of the primitive type `COMPACT_ARRAY`. You can read about the serialization of all the primitive types (shown in capital letters) [here](https://kafka.apache.org/protocol#protocol_types).

The `_tagged_fields` is a special field used for extensibility and is not relevant for this extension. You can safely always assume it to be `0` byte, encoded as a variable unsigned integer.

</details>

## Reading from disk: Understanding Kafka’s log files

To serve a `FetchRequest`, your Kafka server must know:

- What topics exist
- Which partitions they contain
- Where their messages are stored

And all of this comes from reading **log files** stored on disk. All the log files are stored in a single directory, which is specified in the `server.properties` configuration file under the `log.dirs` property. The `log.dirs` property is a comma-separated list of directories, and the Kafka server will read from all of them.

> For the CodeCrafters environment, the `server.properties` file is located at `/tmp/server.properties`, and the `logs.dir` property is set to `/tmp/kraft-combined-logs`. You can safely hardcode this path in your implementation.

There are primarily two types of log files you need to be aware of:

1.  **Cluster Metadata Logs**

    Kafka stores cluster metadata in a special topic called `__cluster_metadata`. This includes all the high-level information about topics, partitions, and leaders. The names of the log files in this directory correspond to the offsets of the first record in each file. The first one is always `00000000000000000000.log`, and subsequent files are approximate multiples of `S`, where `S` is the size of the log segment.

    > There would be just one cluster-metatdata log file in the tests. Thus the only cluster log file you need to parse is present at `/tmp/kraft-combined-logs/__cluster_metadata/00000000000000000000.log`.

2.  **Topic Log Files**

    Message data for each topic is stored in subdirectories named after the topic and its partition — for example, for a topic named `test-topic` with two partitions, the first log files would be:

    - `test-topic-0/00000000000000000000.log`
    - `test-topic-1/00000000000000000000.log`

    The naming convention for the log files is the same as for the cluster metadata logs, with the first file being `00000000000000000000.log`, and subsequent files being approximate multiples of `S`.

    > Each topic-partition folder would also contain just a single log file in all the tests, named `00000000000000000000.log`.

Both of these files follow the same binary encoding, but contain different types of data and information.

### Reading the log files

Both the cluster metadata and topic log files are stored on disk following the same serialization protocol. Each log file consists a number of `RecordBatches` serialized into binary one after the other. `RecordBatch` is the basic unit of storage in Kafka and contains a set of records, which are the actual data that is being stored.

The on-disk format of a `RecordBatch` is:

```
baseOffset => INT64
batchLength => INT32
magic => INT8
partitionLeaderEpoch => INT32
crc => INT32
attributes => INT16
lastOffsetDelta => INT32
baseTimestamp => INT64
maxTimestamp => INT64
producerId => INT64
producerEpoch => INT16
baseSequence => INT32
recordsCount => INT32
records => [Record]
```

<br>

<details>
<summary> Optional Reading: Parsing the <b>attributes</b> field </summary>

The `attributes` field is a bit field that contains a number of flags that describe the record batch. The role of the various bits in the `attributes` field is as follows:

- `0-2`: They denote the compression type used for the record batch. The values are as follows:

  - `0`: No compression
  - `1`: Gzip
  - `2`: Snappy
  - `3`: LZ4
  - `4`: ZSTD

- `3`: This bit indicates the timestamp type. If it is set to `1`, it means that the timestamps in the record batch are of type `CreateTime`. If it is set to `0`, it means that the timestamps are of type `LogAppendTime`.
- `4`: This bit indicates whether the record batch is transactional. If it is set to `1`, it means that the record batch is transactional. If it is set to `0`, it means that the record batch is not transactional.
- `5`: This bit indicates whether the record batch is a control batch. If it is set to `1`, it means that the record batch is a control batch. If it is set to `0`, it means that the record batch is not a control batch.
- `6`: This bit indicates whether the record batch has a delete horizon. If it is set to `1`, it means that the record batch has a delete horizon. If it is set to `0`, it means that the record batch does not have a delete horizon.
- `7-15`: These bits are unused and should be set to `0`.

</details>

Most of the fields are self-explanatory, and do not really matter for this extension. However, some important discussions are worth having.

- All of the integers in the CNF are big-endian encoded as in the rest of the on-wire protocol.
- The current magic value is `2`.
- When compression is enabled, the compressed record data is serialized directly following the count of the number of records. The `CRC` covers the data from the attributes to the end of the batch (i.e. all the bytes that follow the `CRC`). The [CRC-32C](https://github.com/google/crc32c) polynomial is used for the computation.
  > All the log files written by the tester are uncompressed, so you can ignore the compression-related fields.
- The `recordCount` field is the number of times you should parse a record from the offset of the `records` field. The `[Record]` notation here does not mean a `COMPACT_ARRAY` (as in the Kafka protocol documentation), but rather a list of records.

The `Record` type is defined as follows:

```
length => VARINT
attributes => INT8
timestampDelta => VARLONG
offsetDelta => VARINT
keyLength => VARINT
key => BYTE[]
valueLength => VARINT
value => BYTE[]
headersCount => VARINT
headers => [Header]
```

The `Record` type can be thought of as a key-value pair, where the key is optional and the value is the actual message. The `headers` field is an array of headers that can be used to store additional metadata about the record. All of the length fields are to be used to determine the length of the corresponding field, and should be used to parse the record correctly.

> All the records in any of the log files written by the tester have no headers (headersCount = 0) and the key associated with them is always empty (keyLength = 0). So you can safely ignore them as well.

Fun fact about the `attributes` field on `Record`: Currently all the 8 bits are unused! Talk about a waste of space! But it is used for extensibility, so perhaps in the future, it will be used for something useful.

However, marching on, the on-disk format of a `Header` is as follows:

```
headerKeyLength => VARINT
headerKey => STRING
headerValueLength => VARINT
headerValue => BYTE[]
```

Please note that the all of the length fields used in the above rules may also have their value set to `-1`, which means that the corresponding field is not set. For example, if the `keyLength` is set to `-1`, then the `key` field should be ignored.

The value byte array is the actual data that is being stored in the record, that may or may not need further deserialization. In the case of topic log files, the value is the actual message that was sent to the topic, and thus needs no further processing. However, in the case of cluster metadata logs, the value is a sequence of bytes that needs to be parsed to get the actual metadata.

### Parsing the record value for cluster metadata logs

The value object for the cluster metadata log file can be thought to have two parts:

- A header, which is a fixed-length object that contains the information about body of the value.
- A body, which is a variable-length object that contains the actual metadata.

The CNF rule for the header is as follows:

```
Header => frame_version type version
  frame_version => INT8
  type => INT8
  version => INT16
```

Based on the `type` field, the body can be one of the following:

- 2: `TopicBody`
- 3: `PartitionBody`
- 12: `FeatureLevelBody`

The CNF rules for the body objects are as follows:

```
FeatureLevelBody => name feature_level _tagged_fields
  name => COMPACT_STRING
  feature_level => INT16
```

> These types of records are not present in the tests, so you may ignore implementing them.

```
TopicBody => name id _tagged_fields
  name => COMPACT_STRING
  id => UUID
```

> These records are present in the tests, and can be used to maintain a mapping between the topic name and it's ID. This is needed as the `FetchRequest` uses the topic ID to identify the topic, while you need the topic name to read topic log files.

```
PartitionBody => partition_index topic_id [replica] [isr] [removing_replica] [adding_replica] leader_id leader_epoch partition_epoch [directory_id] _tagged_fields
  partition_index => INT32
  topic_id => UUID
  replica => INT32
  isr => INT32
  removing_replica => INT32
  adding_replica => INT32
  leader_id => INT32
  leader_epoch => INT32
  partition_epoch => INT32
  directory_id => UUID
```

> These records are also present in the tests, and can be used to maintain a mapping between the topic ID and which all partition indexes it contains.

All the arrays used in the above rules are of the primitive type `COMPACT_ARRAY`.

## Bringing it all together

So, enough of the theory. Now the fun part: how should you go about implementing the handler for the `FetchRequest`? The final implementation should probably look something like this:

1. On startup, read the cluster metadata log file and parse the records to get the mappings between topic ids, names and the partition indexes. [This](#reading-the-log-files) and [this section](#parsing-the-record-value-for-cluster-metadata-logs) contains the all binary encoding rules you need to implement for this.

2. A `FetchRequest` in essence contains a list of topics, and each topic contains a list of partitions for which it wants to fetch all the messages. So, the first step is to parse the `FetchRequest` appropiately. The CNF rules for the `FetchRequest` are [here](#the-fetch-api).

3. Loop for each of the topic in the request. For each topic, we will have a `response` object in the `FetchResponse`.

   - If the topic is not present in your metadata, the response should only contain one partition with the `UNKNOWN_TOPIC_ID_ERROR_CODE` (100) error code.

   - If the topic exists, loop over each of the requested partition indexes and create a partition in the `response.partitions` array corresponding to it.
     - The tester always send valid partition indexes, so you don't need to worry about invalid partition indexes.
     - You should read the data directly from the topic log file for the topic - partition pair **without parsing**! The `records` field required in the response partition is nothing is this exact data, prepended by the length of this data encoded as a variable unsigned integer!

It's quite a mouthful already, but I promise you it's easier that it seems! Reading all this at one go is overwhelming, but you are not expected to keep it all in your mind at once. The stages breakdown on the platform will help you to implement all of this functionality incrementally, so don't worry! Think of this blog as a reference on the encoding formats for when you need it, and nothing more!

## Shameless self-promotion

If you're having troubles implementing the same, you can refer to my [implementation](https://github.com/EshaanAgg/toy-kafka). Starring [this implementation](https://github.com/EshaanAgg/toy-kafka) or [my blog](https://github.com/EshaanAgg/web) would be a great way to stroke my fragile tech-bro ego and would let me know that this blog helped you! If you have any suggestions or feedback on the same, I would love to hear from you either through [GitHub issues](https://github.com/EshaanAgg/web/issues) or on the [CodeCrafters forum](https://forum.codecrafters.io/t/blog-curating-all-the-pre-requisites-for-the-consuming-messages-extension/10438)!

Until the time we update our implementation to handle all those 100's of request parameters we ignored, so long traveller.
