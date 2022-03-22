# Stop all ECS Tasks

## Install the script

- install node.js (>=14)
- clone the repository
- run `npm install` command within repository

## Run the script

**run with env variables**

- `AWS_DEFAULT_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

```
node ./stop-cluster-tasks.js -c <ECS cluster name> -r <AWS region>
```

**run with AWS credentials as input params**

```
node ./stop-cluster-tasks.js -c <ECS cluster name> -r <AWS region> -k <AWS_ACCESS_KEY_ID> -s <AWS_SECRET_ACCESS_KEY>
```