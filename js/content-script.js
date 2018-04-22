/**
 * 文档注释
 * 注意这个网站架构很奇怪，第二册和第四册架构相同应该是同一个团队写的，但是和第一册第三册架构完全不同。cookie没见过的用法
 * 原网站js就是面向过程，我注入的时候也面向过程了
 */

//获取当前url中的UnitID，SectionID,SisterID
var url=window.location.href
var UnitID=url.charAt(54)
var SectionID=url.charAt(59)
var SisterID=url.charAt(61)
var answer=''

//日志信息
console.log(UnitID+" "+SectionID+" "+SisterID)



//id错误纠正，多半是由于网站不是同一批人开发的，前后id混乱，测试到Unit5也没有规律所以暂时只支持刷到第五单元。不知道js支不支持持?表达式我就不用了
if (SectionID=="3") {
    if (UnitID=="3") {
        if (SisterID>="4") { //js支持
            SisterID=parseInt(SisterID)+2+""
        }
    }
    else {
        if (SisterID>="4") {
            SisterID=parseInt(SisterID)+1+""
        }
    }
}
if (UnitID=="4"&&SectionID=="3"&&SisterID=="5") {
    SisterID="4"
}



//日志
console.log(UnitID+" "+SectionID+" "+SisterID)


//准备post到服务器的数据,为题目定位信息，单元号，章节号，题号
var postData = {};
loadUrl = '/book/book184/initPage.php';
dataType = 'json';
postData['UnitID']=UnitID;
postData['SectionID']=SectionID;
postData['SisterID']=SisterID;

//设定ajax要赋值的全局变量
var answer=''
var ItemID=''

//POST发送数据，返回的居然是个json格式的字符串，转成json对象再赋值给全局变量。
//注意ajax要设置成非异步(async:false)，否则数据还没返回就赋值会得到个undefined
$.ajax({
    type: 'POST',
    url: loadUrl,
    async:false,
    data: postData,
    success: function (data) {
    //成功时执行的函数
    data=eval("("+data+")")//相当于$.parseJSON()
    answer=data.key //包含答案的字符串
    ItemID=data.ItemID
    //这个id不知道干什么的，可能一本书里所有题目的唯一标识吧(把从第一单元到第八单元所有题目按顺序排一遍给个序号)
    }
})

//日志，打印获取的答案
console.log(answer)


//显示答案模块

//判断题型

//选择题
if ($(".answerLi").length>0) {
    console.log("选择题")
    selector="input"
    spliter="^"
    spliter = spliter || "^";
    var answerArr = answer.split(spliter);


    $(".answerLi").each(function(num){
        $(this).find("li").each(function(i){
            if($(this).find(selector).attr("value")==answerArr[0]){
                console.log($(this).find("input").val())
                // $(this).find(selector).prop("checked","checked"); 
                //要模拟鼠标点击，否则直接修改属性不会触发它内部的校验 
                $(this).find(selector).click();  
                answerArr.shift();
                return false;//退出到answerLi层循环(到下一题)
            }
        })
    })
}

//填空题
else if ($(".content_text").length>0) {
    console.log("填空题")
    console.log("填空题")
    selector="input"
    spliter="^"
    spliter = spliter || "^";
    var answerArr = answer.split(spliter);

    x=0
    $(".content_text").each(function(num){
        $(this).find("li").each(function(j){
            $(this).find("p").find(selector).each(function(i){
                $(this).prop("value",answerArr[x].split("|")[0]);
                //触发校验
                $(this).focus();
                $(this).prop("id",x)
                document.getElementById(x).focus(); 
                x++;
            })
        })
    })
}


//多选题
else if ($(".option").length>0&&$(".plugin-table").length==0) {
    console.log("多选题")
    selector="input"
    spliter="^"
    spliter = spliter || "^";
    var answerArr = answer.split(spliter);

    $(".option").find("li").each(function(num){
        if($(this).find(selector).prop("value")==answerArr[0]){
            $(this).find(selector).click();  
            answerArr.shift();
        }
    })
}

//拖拽题(全自动示例，不需要点击submit即可完成提交)
else if ($(".sub-item").length>0) {
    selector='.sub-item'
    var spliter = spliter || '^';
	var answerArr = answer.split(spliter);
	var selectors = $(selector);
	var selectorsNew = $(selector);
	for (var i = 0; i < selectors.length; i++) {
		$(selector).eq(i).before($(selector+"[data-value='"+answerArr[i]+"']"))
	}

}



//表格多选题
else if ($(".plugin-table").length>0) {
    console.log("表格多选题")
    selector="input"
    spliter="^"
    spliter = spliter || "^";
    var answerArr = answer.split(spliter);

    $(selector).each(function(num){
        if($(this).prop("value")==answerArr[0]){
            $(this).click();  
            answerArr.shift();
        }
    })
}

else if($("next-button").length>0){
    window.alert("主观题")
}
