#!/bin/sh
forever stop server.js
forever -o out.log -e err.log start server.js 
