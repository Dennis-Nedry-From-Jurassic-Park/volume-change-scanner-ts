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