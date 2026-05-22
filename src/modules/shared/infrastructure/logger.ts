import { Logger } from 'tslog';

export const logger = new Logger({
  name: 'backend',
  type: 'pretty',
  prettyLogTemplate:
    '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t{{fileName}}:{{fileLine}}{{nameWithDelimiterPrefix}}\t',
  prettyErrorStackTemplate:
    '  • {{fileName}}:{{fileLine}}\t{{method}}\n\t{{filePathWithLine}}',
  prettyLogStyles: {
    fileName: 'yellow',
    fileLine: 'white',
    filePathWithLine: 'white',
  },
});
