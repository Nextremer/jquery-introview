# jQuery Introview Plugin

フリック操作可能なモバイルアプリケーションのイントロスライドを表示するためのjQuery Pluginです。
モバイルアプリケーションの初回起動時の操作説明など、イントロダクションのUI作成が可能です。

# Setup

```
$ bower install jquery-introview
```

# Getting Started

## Step 1 必要なファイルを設定する

```html
<!-- introview css file -->
<link rel="stylesheet" href="./bower_components/jquery-introview/jquery.introview.css">
<!-- required js files of introvew -->
<script src="./bower_components/jquery/dist/jquery.min.js"></script>
<script src="./bower_components/jquery-easing-original/jquery.easing.min.js"></script>
<script src="./bower_components/jquery-touchswipe/jquery.touchSwipe.min.js"></script>
<script src="./bower_components/jquery-introview/jquery.introview.1.0.js"></script>
```

## Step 2 HTMLマークアップを作成する

```html
<div id="introview">
    <section>
        <p>this is first</p>
    </section>
    <section>
        <p>this is second</p>
    </section>
    <section>
        <p>this is third</p>
    </section>
    <section>
        <p>this is forth</p>
    </section>
    <section>
        <p>this is fifth</p>
    </section>
</div>
```

## Step 3 introview を実行する

```javascript
var options {
        'finishCallback': function() {
            $('#introview').hide();
        }
    };
$(document).ready(function() {
    $('#introview').introview();
});
```

# Options

オプションを引数にとることで設定を変更することができます。

```javascript
var options = {
        "duration": 500,
        "easing": "easeOutQuart",
        "finishCallback": function(){}
    };
$('#introview').introview(options);
```

**duration**
ページがスライドする速度をmsで指定します。(default 500);

**easing**
イージングの種類を指定します。(default "easeOutQuart")  
イージングの種類は [jquery.easing](http://gsgd.co.uk/sandbox/jquery/easing/) のメソッドが使えます。

**finishCallback**
全てのページスライドが完了もしくはSkipされたときのコールバックを指定します。(default function(){})

# Lisense

Dual licensed under the MIT or GPL Version 2 licenses.
