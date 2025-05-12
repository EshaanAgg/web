---
title: "Consuming Messages | Build Your Own Kafka"
description: All the concepts, and documentation you need to know to need to pass the "Consume Messages" test in the Build Your Own Kafka challenge.
pubDate: 2025-05-12
tags: ["kafka", "codecrafters", "2025"]
draft: true
pinned: true
---

The [**Build Your Own Kafka**](https://app.codecrafters.io/courses/kafka/introduction) challenge on CodeCrafters is an advanced systems programming project where you're tasked with recreating key components of [Apache Kafka](http://kafka.apache.org/) — a high-throughput, distributed event streaming platform.

One of the most critical and intricate parts of this challenge is the **“Consuming Messages”** extension, which involves implementing the **Fetch API** — the mechanism through which consumers retrieve messages from Kafka topics.

This blog is my personal technical log — a resource I wished I had when I started. The Fetch API itself isn’t inherently complex, but the sparse documentation and scattered prerequisites can make it feel overwhelming. Instead of walking through implementation details (which vary by language and architecture), I aim to unpack the necessary concepts, protocol requirements, and Kafka-specific architecture that you need to confidently tackle this extension.

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

And all of this comes from reading **log files** stored on disk. All the log files are stored in a single directory, which is specified in the `server.properties` configuration file under the `log.dirs` property. For the CodeCrafters environment, the `server.properties` file is located at `/tmp/server.properties`, and the log files are stored in the directory `/tmp/kraft-combined-logs`.

There are primarily two types of log files you need to be aware of:

1.  Cluster Metadata Logs

    Kafka stores cluster metadata in a special topic called `__cluster_metadata`. This includes all the high-level information about topics, partitions, and leaders. The names of the log files in this directory correspond to the offsets of the first record in each file. The first one is always `00000000000000000000.log`, and subsequent files are approximate multiples of `S`, where `S` is the size of the log segment.

    For passing this extension, reading the first log file in this directory is all you need to do. Thus you can safely hardcode the log path to `/tmp/kraft-combined-logs/__cluster_metadata/00000000000000000000.log`, and only parse it appropiately to get all the relevant metadata.

    Note: This is definetely not the only approach to take, but it seemed like the most straightforward one to me, and thus I would be discussing it in detail here. The other approach would be to read all the topic log files and then parse the metadata from there, but that is for the brave like you!

2.  Topic Log Files

    Message data for each topic is stored in subdirectories named after the topic and its partition — for example:

    - `test-topic-0/00000000000000000000.log`
    - `test-topic-1/00000000000000000000.log`

    Each file again is named after the offset of the first message it contains.

    The CodeCrafters environment would also create each the appropiate directories and the log files for each topic and partition, so if you wish to read them, do take a short. I won't be providing their exact formats here. (I tried to find them, but could not have significant progress. If you know more about this, please hit me up and I will update this blog post accordingly!)

## Reading the log files

Both the cluster metadata and topic log files are in a binary format, and follow the same structure. Each log file consists a number of `RecordBatches` serialized into binary one after the other. `RecordBatch` is the basic unit of storage in Kafka and contains a set of records, which are the actual data that is being stored.

The on-disk format of a `RecordBatch` is:

```
baseOffset => INT64
batchLength => INT32
magic => INT8 (current magic value is 2)
partitionLeaderEpoch => INT32
crc => INT32
attributes => INT16
    bit 0~2:
        0: no compression
        1: gzip
        2: snappy
        3: lz4
        4: zstd
    bit 3: timestampType
    bit 4: isTransactional (0 means not transactional)
    bit 5: isControlBatch (0 means not a control batch)
    bit 6: hasDeleteHorizonMs (0 means baseTimestamp is not set as the delete horizon for compaction)
    bit 7~15: unused
lastOffsetDelta => INT32
baseTimestamp => INT64
maxTimestamp => INT64
producerId => INT64
producerEpoch => INT16
baseSequence => INT32
recordsCount => INT32
records => [Record]
```

Most of the fields are self-explanatory, and do not really matter for this extension. However, some important discussions are worth having.

- All of the integers in the CNF are big-endian encoded as in the rest of the on-wire protocol.
- When compression is enabled, the compressed record data is serialized directly following the count of the number of records. The `CRC` covers the data from the attributes to the end of the batch (i.e. all the bytes that follow the `CRC`). The `CRC-32C (Castagnoli)` polynomial is used for the computation.
- For the purpose of this extension, all the log files are uncompressed, so you can ignore the compression-related fields.
- The `recordCount` field is the number of times you should parse a record from the offset of the `records` field. The `[Record]` notation here does not mean a `COMPACT_ARRAY` (as in the Kafka protocol documentation), but rather a list of records.

The `Record` type is defined as follows:

```
length => VARINT
attributes => INT8
    bit 0~7: unused
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

The on-disk format of a `Header` is as follows:

```
headerKeyLength => VARINT
headerKey => STRING
headerValueLength => VARINT
headerValue => BYTE[]
```

Please note that the all of the length fields used in the above rules may also have their value set to `-1`, which means that the corresponding field is not set. For example, if the `keyLength` is set to `-1`, then the `key` field should be ignored.
