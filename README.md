# Two hour blocks challenge

## Hypothesis

- Bitcoin difficulty is calculated for new blocks to generate every ten minutes, or 600 seconds.
- Each second is a 1 in 600 chance of generating a block.
- There are 7200 seconds in two hours.
- Hashing has a binary outcome: valid or invalid.
- Using Binomial Probability, the chance of 0 successes of a 1/600 event in 7200 tries is 0.00000608301.
- At present count of roughly 700000 blocks, this is likely to have occurred 4.26 times.
- It can be expected to occur about once every 164,319.25 blocks.

## Requirements

- Raw bitcoin blockchain data from a [Bitcoin Node](https://bitcoin.org/en/download)
- [rusty-blockparser](https://github.com/gcarq/rusty-blockparser)

## Setup

Use [rusty-blockparser](https://github.com/gcarq/rusty-blockparser) to generate a csv file in this directory.
`./target/release/rusty-blockparser -d BITCOIN_DATA_DIRECTORY csvdump THIS_DIRECTORY/data`

Each row of our blockchain CSV contains the following rows:

- block hash
- height
- version
- blocksize
- previous hash
- hashMerkleRoot
- **time**
- bits
- nonce

Bitcoin timestamps are in Unix time, aka "seconds since Jan 1 1970 UTC". Conveniently, we do not need to parse each
timestamp (such as 1231006505 to Jan 3 2009) because we are only interested in the difference between each sequential
timestamp. By subtracting each timestamp from the one before, we can identify all intervals greater than 7200 (2 hours x
60 minutes x 60 seconds).

Running `npm start` will output analysis like the following:

Evaluating 375053 blocks
The longest interval between blocks was 463160 seconds // 5 days
There have been 150 times 2 hours have elapsed between blocks.
Here they are in order:
[
'Thu Jan 08 2009: 5 days for block 2 || 00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048',
'Fri Jan 09 2009: a day for block 16 || 00000000b3322c8c3ef7d2cf6da009a776e6a99ee65ec5a32f3f345712238473',
'Sat Jan 10 2009: 9 hours for block 29 || 00000000bb0d9430d3d1bab474be5050342161efcca9f7e45b151bff9a700944',
'Sat Jan 10 2009: 3 hours for block 80 || 0000000086e318e8c348dad73199bb6fac8cc1effb9c872a7dda49c5caca0021',
'Sun Jan 11 2009: 3 hours for block 164 || 0000000066fd802a02909e8918fb85943836ce5d99000bdcd8128a06070d140a',
...

## Answer

_This repo will be updated as the blockchain downloads._

Through the first 375053 blocks, there have been **150** intervals of 2+ hours.
