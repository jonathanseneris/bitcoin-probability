#Two hour blocks challenge

##Hypothesis
Bitcoin difficulty deals in large numbers. For example, a random hash has a 1 in 4,294,967,296 chance of being valid.
Bitcoin difficulty is calculated for new blocks to generate every ten minutes, or 600 seconds.
Each second is a 1 in 600 chance of generating a block.
There are 7200 seconds in two hours.
Hashing has a binary outcome: valid or invalid. Using Binomial Probability, the chance of 0 successes of a 1/600 event in 7200 tries is 0.00000608301.
At present count of roughly 700000 blocks, this is likely to have occurred 4.26 times.
It can be expected to occur about once every 164,319.25 blocks.

##Requirements

- Raw bitcoin blockchain data
- [rusty-blockparser](https://github.com/gcarq/rusty-blockparser)

##Setup

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
