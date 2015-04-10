
 loadbmp "hands", "hands.bmp"
   loadbmp "d1", "dice1.bmp"
  loadbmp "d2", "dice2.bmp"
  loadbmp "d3", "dice3.bmp"
  loadbmp "d4", "dice4.bmp"
  loadbmp "d5", "dice5.bmp"
 loadbmp "d6", "dice6.bmp"
  loadbmp "d7", "dice6.bmp"

 dim images$(160)
    for x = 1 to 156 step 6
        images$(x) = "d1"
        images$(x+1) = "d2"
        images$(x+2) = "d3"
        images$(x+3) = "d4"
        images$(x+4) = "d5"
        images$(x+5) = "d6"
        images$(x+6) = "d7"
      next x


nomainwin


WindowWidth = 700
  WindowHeight = 500


 button #main.actionButton, "Roll", [action], UL, 500, 50, 100, 80
graphicbox #main.draw, 10, 10, 410, 310

open "Dice" for window_nf as #main
print #main, "trapclose [quit]"
print #main.draw, "drawbmp hands"


wait


[mainLoop]

  input r$
  goto [mainLoop]


[action]
delay = 0
    for x = 1 to 55
        print #main.draw, "drawbmp "; images$(x); " 0 0"

        delay = delay + 15
        for y = 1 to delay : next y
    next x


    item1$ = images$(int(rnd(1)*5)+1)


    print #main.draw, "cls ; drawbmp "; item1$; " 0 0"

    print #main.draw, "flush"




    goto [mainLoop]

[quit]

    close #main
    end
