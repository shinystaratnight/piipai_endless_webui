#!/bin/bash
echo "Start building..."
if (${WEB_PRODUCTION}) ; then
  exec make
else
  exec make staging
fi;
echo "Building finished"
