@echo off
for /l %%i in (1,1,20) do (
    start python "test.py"
)
