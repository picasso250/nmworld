import panel as pn  # GUI
pn.extension()

panels = [] # collect display 

context = [ {'role':'system', 'content':"""
You are a developer.
你的代码符合工程方法论，符合封装功能成函数、避免魔数、丰富注释的原则。
一个最简单的Phaser 3游戏的例子，我给出了一个包含HTML和JS代码的例子。让图片随机游走起来
现在，你需要记住这些并回复“明白”。
"""} ]  # accumulate messages


inp = pn.widgets.TextAreaInput(value="Hi", height=120)
button_conversation = pn.widgets.Button(name="Chat!")

interactive_conversation = pn.bind(collect_messages, button_conversation)

dashboard = pn.Column(
    inp,
    pn.Row(button_conversation),
    pn.panel(interactive_conversation, loading_indicator=True, height=300),
)

dashboard