
print amPmTime$(time$())

function amPmTime$(time$)

    colonIndex = instr(time$, ":")
    hours = val(left$(time$, colonIndex - 1))
    amOrPm$ = " AM"
    if hours > 12 then
            hours = hours - 12
            amOrPm$ = " PM"
        else
            if hours = 0 then hours = 12
    end if
    amPmTime$ = str$(hours) + mid$(time$, colonIndex) + amOrPm$

end function
