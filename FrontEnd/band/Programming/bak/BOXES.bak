

    ' draw some boxes

    dim color$(6)
    color$(1) = "red"
    color$(2) = "brown"
    color$(3) = "yellow"
    color$(4) = "green"
    color$(5) = "blue"
    color$(6) = "darkpink"

    count = 1
    vector = 1

    open "Boxes" for graphics as #1
        print #1, "down"
        print #1, "size 1"
        print #1, "place 130 130"
        for x = 30 to 230 step 5
            print #1, "color "; color$(count)
            count = count + vector
            if count = 1 and vector < 0 then vector = 1
            if count = 6 then vector = -1
            print #1, "box "; x ; " "; 260 - x
            print #1, "flush"
        next x
        print #1, "segment segId"
        for x = 1 to segId - 1 step 2
            print #1, "delsegment "; x
        next x
        print #1, "redraw"
        wait
    close #1
