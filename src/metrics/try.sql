


SELECT
$timeSeries as t,
arrayJoin(groupArray(total / 60)) as `Баланс (ИИС)`,
account_name,
arrayJoin(groupArray(time))
FROM $table

WHERE  account_name = 'ИИС'

GROUP BY account_name,total,t,time

ORDER BY t



SELECT
$timeSeries as t,
arrayJoin(groupArray(total / 60)) as `Баланс (Брокерский счёт)`,
account_name,
arrayJoin(groupArray(time))
FROM $table

WHERE  account_name = 'Брокерский счёт'

GROUP BY account_name,total,t,time

ORDER BY t























SELECT
    $timeSeries as t,
    sum(CVC_Demand_Per_Subscriber) value
FROM  (
  SELECT toDateTime(time) AS Time, total / 60 as `Баланс (ИИС)`
   FROM　operations.GetPortfolio where account_name = 'ИИС'
  )
GROUP BY t
ORDER BY t



SELECT $__time(ts) as Time, total / 60 as `Баланс (ИИС)`, toDateTime64(time, 3, 'Europe/Moscow') as ts, account_name AS groupArr FROM　operations.GetPortfolio where account_name = 'ИИС'
SELECT   FROM　operations.GetPortfolio2 where account_name = 'ИИС'



SELECT
    $timeSeries as t,
    total / 60 as t,
    time as ts, account_name AS groupArr
FROM $table

WHERE  account_name = 'ИИС'

GROUP BY t, total, ts, account_name

ORDER BY t




SELECT
    total / 60 as `Баланс (ИИС)`,
    time as ts,
    account_name
FROM $table

WHERE account_name = 'ИИС'

ORDER BY ts




SELECT
total / 60 as total,
time,
account_name
FROM $table
WHERE  account_name = 'ИИС'
GROUP BY total, time, account_name　ORDER BY time






SELECT
    total / 60 as total,
    time as ts,
    account_name
FROM $table

WHERE  account_name = 'ИИС'

GROUP BY total, ts, account_name

ORDER BY ts









SELECT
arrayJoin(groupArray(total / 60)) as `Баланс (ИИС)`,
account_name,

    $timeSeries as t,
     arrayJoin(groupArray(time) ) as ajts,
    time as ts
FROM $table

WHERE  account_name = 'ИИС'

GROUP BY t, total, ts, account_name, ajts

ORDER BY t






SELECT
    $timeSeries as t,
    total / 60 as `Баланс (ИИС)`,
    time as ts, account_name AS groupArr
FROM $table

WHERE  account_name = 'ИИС'

GROUP BY t, total, ts, account_name

ORDER BY t