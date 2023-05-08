def collect_messages(_):
    prompt = inp.value_input
    inp.value = ''
    context.append({'role':'user', 'content':f"{prompt}"})
    response = get_completion_from_messages(context) 
    context.append({'role':'assistant', 'content':f"{response}"})
    panels.append(
        pn.Row('User:', pn.pane.Markdown(prompt, width=600)))
    panels.append(
        pn.Row('Assistant:', pn.pane.Markdown(response, width=600, style={'background-color': '#F6F6F6'})))
 
    return pn.Column(*panels)

import panel as pn  # GUI
pn.extension()

panels = [] # collect display 

context = [ {'role':'system', 'content':"""
You are a developer.
你的代码符合工程方法论，符合封装功能成函数、避免魔数、丰富注释的原则。
有一个 Phaser 3 引擎 做的游戏.
里面的sprite有role和food,并且都已经在对应的group里面了.
当我要求你重构(拆分)某段函数的时候,你要记得拆分的粒度不要太细碎,避免那些只有一行的小函数.
但要记得保留已有注释,并在关键处加上注释.
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