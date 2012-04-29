    $(function(){
         //初期値の文字色
        var d_color = '#999999';
        //通常入力時の文字色
        var f_color = '#000000'; 

        $('#commentQuery').css('color',d_color).focus(function(){
            if(this.value == this.defaultValue){
                this.value = '';
                $(this).css('color', f_color);
            }
        })
        //選択が外れたときの処理
        .blur(function(){
            if($(this).val() == this.defaultValue | $(this).val() == ''){
                $(this).val(this.defaultValue).css('color',d_color);
            };
        });
    });