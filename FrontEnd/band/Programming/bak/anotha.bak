


 loadbmp "hands", "hands.bmp"
   loadbmp "d1", "dice1.bmp"
  loadbmp "d2", "dice2.bmp"
  loadbmp "d3", "dice3.bmp"
  loadbmp "d4", "dice4.bmp"
  loadbmp "d5", "dice5.bmp"
 loadbmp "d6", "dice6.bmp"

 button #main.actionButton, "Roll", [action], UL, 500, 50, 100, 80
graphicbox #main.draw, 10, 10, 400, 300
 button #main.close, "Done", [done], UL, 500, 200, 100, 80
nomainwin


WindowWidth = 700
  WindowHeight = 400




open "Dice" for graphics as #main
print #main, "trapclose [quit]"
print #main.draw, "drawbmp hands"


wait

[action]
x =(int(rnd(1)*6)+1)
print x
if x = 1 then
    print #main.draw, "drawbmp d1"
end if
if x = 2 then
    print #main.draw, "drawbmp d2"
end if
if x = 3 then
    print #main.draw, "drawbmp d3"
end if
if x = 4 then
    print #main.draw, "drawbmp d4"
end if
if x = 5 then
    print #main.draw, "drawbmp d5"
end if
if x = 6 then
    print #main.draw, "drawbmp d6"
end if

wait

[done]
close #main
end


[quit]

    close #main
    end

