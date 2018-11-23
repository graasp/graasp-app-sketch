#!/bin/bash

# if build has already been approved, skip tests
if [ ${CI_BUILD_APPROVED} == 'true' ]; then
  echo "build already approved, skipping tests"
  exit 0
fi

# fail the build on any failed command
set -e

# lint the codebase
yarn lint

# run tests
yarn test:ci
TEST_EXIT_CODE=$?

# report coverage
yarn report

# return the exit code of the test command
exit ${TEST_EXIT_CODE}
