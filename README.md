request body, params, query 로 받아오는 데이터는 class로 지정

body: mustValid(XXXInput)
params: mustValidParams(XXXParams)
query: mustValidQuery(XXXQuery)

DTO는 프론트에서 재사용할 수 있게 interface로 만들기
