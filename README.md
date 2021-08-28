# Two hour blocks challenge

## Summary answers:

1. How often does the Bitcoin network see two consecutive blocks mined more than 2 hours apart from each other?
   - At present day hash/difficulty points, 2 hour intervals would occur about every 639037 blocks. These outliers become even less frequent as difficulty and hashrate increase.
   - Early in the network, 2+ hour intervals would have happened often, as difficulty could not go below 1 even if hash rate did not generate blocks every 10 minutes.

2. How many times the above had happened so far in the history of Bitcoin?
   - 142.  
   - Most occurred in 2009. One occurred in 2011, then none again until 2021. 
   - List at bottom

## Work

For any single block, binomial probability can calculate the odds of 2+ hours without generating a new block, since each hash has a binary outcome (valid / invalid). To calculate, multiply the hash rate to determine the total number of hashes that would be attempted over 2 hours, then calculating the odds of 0 successful hashes out of that total.

For round historical numbers in February 2019, Bitcoin's daily average hashrate stayed around 40 TH/s, and the difficulty was around 6T.

- To get the binomial probability, we use this formula:
  - P(k out of n) = n!/(k!(n-k)!) x pk(1-p)^(n-k)
  - x is the total number of successes
  - P is the probability of a success on an individual trial
  - n is the number of trials.
- Because we are looking for 0 successes, it simplifies much of the formula, as the first section will always simply multiply by 1.
- Therefore, we only need this formula: (1-p)^n
- The probability of a successful hash is valid_hashes / total_hashes
  - a hash is a 256-bit number, so total possible hashes is 2^256
  - valid_hashes is all hashes under the hash target, which is calculated by difficulty_1_target / difficulty.
  - the difficulty_1_target is (2^224 - 2^208), or 2.69 x 10^67. At difficulty 1, this would be the total number of valid hashes.
  - At difficulty 1, the success probability of a single hash is 65535/281474976710656, or 0.00000000023282709...
  - At difficulty D, probability is 65535/(D \* 281474976710656)
  - For February 2019, with difficulty 6T, probability was 4369/112589990684262400000000000 or 3.88/10^23
- A hashrate of 40m TH/s amounts to 288 sextillion (2.88 x 10^23) attempts in two hours.
- With a difficulty multiplier of 6T, the probability of 0 successes in 2 hours is:
  - (1 - (65535/(6 * 10^12 * 281474976710656)))^(2.88 x 10^23) = 0.000014
- Comparing this to other points on the difficulty/hashrate historical chart shows that, as hashrate and difficulty increase, the likelihood of significant outliers (like 2 hour intervals) decreases.
  - 40m TH/s, 6T = 0.000014 (once every 71428 blocks)
  - 100m TH/s, 14T = 0.0000063062795 (once every 158572 blocks)
  - 140m TH/s, 18T = 0.0000021753584710350652 (once every 459694 blocks)
  - 124m TH/s, 15.55T (most current) = 0.000001564852848797462595155 (once every 639037)
  
----
## Requirements

- Raw bitcoin blockchain data from a [Bitcoin Node](https://bitcoin.org/en/download)
- [rusty-blockparser](https://github.com/gcarq/rusty-blockparser)

## Setup

Use [rusty-blockparser](https://github.com/gcarq/rusty-blockparser) to generate a csv file in this directory.
`./target/release/rusty-blockparser -d BITCOIN_DATA_DIRECTORY csvdump THIS_DIRECTORY/data`

Then run `npm i` and `npm start`

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

## Output


- Thu Jan 08 2009: 5 days
- Fri Jan 09 2009: a day
- Sat Jan 10 2009: 9 hours
- Sat Jan 10 2009: 3 hours
- Sun Jan 11 2009: 3 hours
- Sun Jan 11 2009: 4 hours
- Wed Jan 21 2009: 3 hours
- Thu Jan 22 2009: 2 hours
- Fri Jan 23 2009: 4 hours
- Fri Jan 23 2009: 4 hours
- Mon Jan 26 2009: 3 hours
- Mon Jan 26 2009: 3 hours
- Sat Mar 21 2009: 3 hours
- Sat Mar 21 2009: 3 hours
- Sat Mar 21 2009: 4 hours
- Thu Apr 23 2009: 4 hours
- Thu Apr 23 2009: 3 hours
- Sat May 02 2009: 2 hours
- Sat May 09 2009: 3 hours
- Sun May 10 2009: 3 hours
- Tue May 19 2009: 7 hours
- Thu May 21 2009: 2 hours
- Thu May 21 2009: 3 hours
- Sat May 23 2009: a day
- Sat May 23 2009: 2 hours
- Sun May 24 2009: 5 hours
- Thu May 28 2009: 2 hours
- Sun May 31 2009: 5 hours
- Mon Jun 01 2009: 3 hours
- Mon Jun 01 2009: 4 hours
- Wed Jun 03 2009: 6 hours
- Thu Jun 04 2009: 9 hours
- Sat Jun 06 2009: a day
- Sat Jun 06 2009: 3 hours
- Sun Jun 07 2009: 20 hours
- Sun Jun 14 2009: 2 hours
- Thu Jun 25 2009: 3 hours
- Wed Jul 15 2009: 7 hours
- Fri Jul 17 2009: 10 hours
- Sat Jul 18 2009: 13 hours
- Sat Jul 18 2009: 4 hours
- Sat Jul 18 2009: 7 hours
- Wed Jul 22 2009: 3 hours
- Sat Jul 25 2009: 3 hours
- Sat Jul 25 2009: 2 hours
- Sun Jul 26 2009: 17 hours
- Sun Jul 26 2009: 3 hours
- Sun Jul 26 2009: 2 hours
- Sun Jul 26 2009: 2 hours
- Tue Jul 28 2009: 2 hours
- Tue Jul 28 2009: 3 hours
- Tue Jul 28 2009: 2 hours
- Tue Jul 28 2009: 4 hours
- Wed Jul 29 2009: 2 hours
- Wed Jul 29 2009: 3 hours
- Wed Jul 29 2009: 3 hours
- Wed Jul 29 2009: 3 hours
- Thu Jul 30 2009: 8 hours
- Thu Jul 30 2009: 3 hours
- Thu Jul 30 2009: 2 hours
- Thu Jul 30 2009: 3 hours
- Fri Jul 31 2009: 3 hours
- Fri Jul 31 2009: 8 hours
- Fri Jul 31 2009: 2 hours
- Sat Aug 01 2009: 5 hours
- Sat Aug 01 2009: 2 hours
- Sat Aug 01 2009: 3 hours
- Sun Aug 02 2009: 3 hours
- Sun Aug 02 2009: 3 hours
- Sun Aug 02 2009: 2 hours
- Sun Aug 02 2009: 3 hours
- Mon Aug 03 2009: 8 hours
- Mon Aug 03 2009: 4 hours
- Mon Aug 03 2009: 3 hours
- Mon Aug 03 2009: 2 hours
- Mon Aug 03 2009: 4 hours
- Sat Aug 15 2009: 2 hours
- Sat Aug 15 2009: 4 hours
- Sat Aug 15 2009: 2 hours
- Sat Aug 15 2009: 3 hours
- Sun Aug 16 2009: 3 hours
- Sun Aug 16 2009: 4 hours
- Sun Aug 16 2009: 6 hours
- Mon Aug 17 2009: 3 hours
- Mon Aug 17 2009: 2 hours
- Mon Aug 17 2009: 4 hours
- Mon Aug 17 2009: 5 hours
- Tue Aug 18 2009: 3 hours
- Tue Aug 18 2009: 5 hours
- Tue Aug 18 2009: 5 hours
- Tue Aug 18 2009: 3 hours
- Wed Aug 19 2009: 8 hours
- Wed Aug 19 2009: 3 hours
- Wed Aug 19 2009: 4 hours
- Thu Aug 20 2009: 4 hours
- Thu Aug 20 2009: 2 hours
- Fri Aug 21 2009: 3 hours
- Fri Aug 21 2009: 11 hours
- Fri Aug 21 2009: 4 hours
- Sat Aug 22 2009: 2 hours
- Sat Aug 22 2009: 4 hours
- Sat Aug 22 2009: 3 hours
- Sat Aug 22 2009: 4 hours
- Sat Aug 22 2009: 7 hours
- Sat Aug 22 2009: 3 hours
- Sun Aug 23 2009: 6 hours
- Sun Aug 23 2009: 4 hours
- Sun Aug 23 2009: 3 hours
- Sun Aug 23 2009: 4 hours
- Mon Aug 24 2009: 6 hours
- Mon Aug 24 2009: 4 hours
- Mon Aug 24 2009: 6 hours
- Tue Aug 25 2009: 6 hours
- Wed Aug 26 2009: 3 hours
- Thu Aug 27 2009: 3 hours
- Thu Aug 27 2009: 5 hours
- Tue Sep 01 2009: 2 hours
- Wed Sep 09 2009: 4 hours
- Tue Sep 15 2009: 4 hours
- Tue Sep 15 2009: 2 hours
- Tue Sep 22 2009: 5 hours
- Tue Sep 22 2009: 2 hours
- Tue Sep 22 2009: 3 hours
- Tue Sep 22 2009: 2 hours
- Wed Sep 23 2009: 5 hours
- Wed Sep 23 2009: 5 hours
- Fri Oct 16 2009: 2 hours
- Fri Oct 23 2009: 3 hours
- Sat Oct 24 2009: 3 hours
- Mon Oct 26 2009: 2 hours
- Sun Nov 01 2009: 2 hours
- Sun Nov 01 2009: 3 hours
- Sun Nov 01 2009: 6 hours
- Mon Nov 02 2009: 2 hours
- Fri Dec 04 2009: 2 hours
- Fri Dec 04 2009: 4 hours
- Sat Dec 05 2009: 3 hours
- Sat Jan 02 2010: 2 hours
- Sun Aug 15 2010: 7 hours
- Thu Oct 13 2011: 2 hours
- Mon Apr 19 2021: 2 hours
- Thu Jul 01 2021: 2 hours
There have been 142 times 2 hours have elapsed between blocks out of 697114 blocks.
