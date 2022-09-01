INSERT INTO GetCandles (*)
select
    arrayElement(array('ENDP','CSCO','NVDA','AAPL','GOOGL'), 1 + rand() % 5),
    arrayElement(array('BBG000BBJQV1','BBG000BBJQV2','BBG000BBJQV3','BBG000BBJQV4','BBG000BBJQV5'), 1 + rand() % 5),
    [1 + rand() % 2],
    [1 + rand() % 2],
    [1 + rand() % 2],
    [1 + rand() % 2],
    [1 + rand() % 2],
    [1 + rand() % 2],
    [1 + rand() % 2],
    [1 + rand() % 2],
    1 + rand() % 2,
    now(),
    1 + rand() % 2,
    1 + rand() % 2
from system.numbers limit 100000000;

/*
SELECT number FROM system.numbers_mt LIMIT 1000000
1000000 rows in set. Elapsed: 0.033 sec. Processed 1.05 million rows, 8.38 MB (31.34 million rows/s., 250.71 MB/s.)


1000000 rows in set. Elapsed: 1.536 sec. Processed 1.05 million rows, 8.38 MB (682.37 thousand rows/s., 5.46 MB/s.)
*/