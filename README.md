frontend of the real-time vehicle tracking application

Uses nextjs14 ( which runs only with node>18.17,not necessarily a restriction however) , styledcomponents,

github action workflows build the application and sends it to aws ecr=> which is
then used for hosting the frontend
(this can also be done via cloudfront)

the api and websocket are hosted via api gateway lambdas
