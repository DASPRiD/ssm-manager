# SSM Manager

A small utility to ease management of the AWS SSM parameter store. It allows you to export and import parameters
for a given prefix to and from `YAML` files.

## Installation

```bash
npm i -g ssm-manager
```

## Usage

To get a list of all commands and their arguments/options, run:

```bash
ssm-manager --help
```

AWS Authentication is handled through the same environment variables that the `aws` CLI command uses. 

### Export parameters

You can export a given prefix to a YAML file:

```bash
ssm-manager export --file=parameters.yaml us-east-1 /my/prefix/
```

You can also omit the `--file` option to output the YAML file directly to `stdout`.

By default `ssm-manager` strips the prefix from all parameter names. If you wish to keep the prefix, you can disable
this feature via the `--keep-prefix` flag.

### Import parameters

To import parameters from a YAML file, run the following command:

```bash
ssm-manager import --prefix=/new/prefix/ us-east-1 parameters.yaml 
```

The prefix option is optional. Omitting it will put all parameters with their given name into the parameter store.

## YAML parameter format

Parameters are stored in a YAML file as a basic object, with each key referencing the name of the parameter in the
store. The value of each parameter can either be a string, in which case the `String` parameter type is used, or it
can be an object with a `type` and `value` property.
