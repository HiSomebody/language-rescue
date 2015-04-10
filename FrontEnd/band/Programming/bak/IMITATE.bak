
    'demonstrates imitation radiobuttons, using checkboxes

    'don't open a main window, please
    nomainwin

    WindowWidth = 270
    WindowHeight = 200

    statictext #cfg, "Confirm File Operations:", 20, 20, 200, 20
    checkbox #cfg.always, "Always", [alwaysConfirm], [setAlways], 40, 45, 130, 20
    checkbox #cfg.whenReplacing, "When Replacing", [whenReplacingConfirm], [setWhenReplacing], 40, 70, 130, 20
    checkbox #cfg.never, "Never", [neverConfirm], [setNever], 40, 95, 130, 20
    button #cfg, " &OK ", [cfgOk], UL, 20, 125
    open "Action Confirmation - Setup" for dialog as #cfg
    print #cfg, "trapclose [cfgOk]"

[inputLoop]
    input h$
    goto [inputLoop]


[alwaysConfirm]

    print #cfg.whenReplacing, "reset"
    print #cfg.never, "reset"
    confrm$ = "always"
    goto [inputLoop]

[setAlways]

    print #cfg.always, "set"
    goto [inputLoop]


[whenReplacingConfirm]


    print #cfg.always, "reset"
    print #cfg.never, "reset"
    confrm$ = "whenReplacing"
    goto [inputLoop]

[setWhenReplacing]

    print #cfg.whenReplacing, "set"
    goto [inputLoop]


[neverConfirm]

    print #cfg.whenReplacing, "reset"
    print #cfg.always, "reset"
    confrm$ = "never"
    goto [inputLoop]

[setNever]

    print #cfg.never, "set"
    goto [inputLoop]



[cfgOk]

    confirm "Save this configuration?"; answer$
    'perform some sort of save for config here

    close #cfg

    end
