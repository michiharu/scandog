const filesCount = (count: number) => (count === 1 ? '1 file' : `${count} files`);

type Status = {
  matched: number;
  exist: number;
  notExist: number;
};

type LogArgs = Parameters<Console['log']>;

class Reporter {
  #hasPrinted = false;
  #status: Status;
  #logger;

  constructor(paths: string[]) {
    this.#status = {
      matched: paths.length,
      exist: 0,
      notExist: 0,
    };

    this.#logger = {
      log: (...args: LogArgs) => {
        this.#hasPrinted = true;
        console.log(...args);
      },
      error: (...args: LogArgs) => {
        this.#hasPrinted = true;
        console.error(...args);
      },
    };
  }

  reportExist() {
    this.#status.exist++;
  }

  reportNotExist(withSuffix: string, target: string) {
    this.#status.notExist++;
    this.#logger.error(`Does not exist: ${withSuffix}`);
    this.#logger.error(`  (Target file: ${target})`);
  }

  printSummary() {
    const { matched, exist, notExist } = this.#status;

    if (matched === 0) {
      console.error('No matching files.');
      process.exitCode = 2;
      return;
    }

    const { log } = this.#logger;

    if (this.#hasPrinted) log();

    log(`Found ${filesCount(matched)}`);

    if (notExist !== 0) log(`${filesCount(notExist)} do not exist.`);
    if (exist !== 0) log(`${filesCount(exist)} exist.`);

    process.exitCode = matched === exist ? 1 : 2;
  }
}

export default Reporter;
