![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white)
![JEST](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

![GitHub contributors](https://img.shields.io/github/contributors/CyrilGoldenschue/VIR1_Deploy?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/CyrilGoldenschue/VIR1_Deploy?style=flat-square)

# VIR1 Deploy

## Authors

- [Cyril Goldenshue](https://github.com/CyrilGoldenschue)
- [Mathieu Rabot](https://github.com/nomeos)
- [Mélodie Ohan](https://github.com/melohan)


## Setting up dev

### Prerequisites
-  npm : >= '8.5.4',
-  node: >= '17.7.1',

### Clone repository

```shell
git clone git@github.com:CyrilGoldenschue/VIR1_Deploy.git
git checkout develop
cd VIR1_Deploy/src 
npm i
```

### Configuration file

Copy `_config.json` to `config.json` and set your `region`.
```
cd src
cp _config.json config.json
```

### Run test
Run all tests
```
npm run test
```

Run only one test
```
 npm run test [className.test.js]
```

### Check your connection

Expected output is the result of `aws ec2 describe-vpcs` command
```shell
node checkCrendentials.js
```
