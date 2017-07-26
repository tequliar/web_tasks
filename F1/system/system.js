//全局变量
var x = 0;//用作判断是执行
var arrayNum = 0;
var infoArray = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
function headOuput(){
    console.log("\n");
    console.log("\t\t\t------------------------- STUDENT INFO MANAGE SYSTEM -------------------------");
    console.log("\t\t\t|*                             1.input record                               *|");
    console.log("\t\t\t|*                             2.delete record                              *|");
    console.log("\t\t\t|*                             3.list record                                *|");
    console.log("\t\t\t|*                             4.search record                              *|");
    console.log("\t\t\t|*                             5.quit system                                *|");
    console.log("\t\t\t------------------------------ -------------- --------------------------------\n");
}


//用于系统循环
function loopExcute() {
    x = prompt("please choose one number !");//用户在控制台输入一个数，存入X中
    if (x == 5) {
        console.log("Exit the System Successful, see you later !");
    } else if (x == 1) {
        inputR();
    } else if (x == 2) {
        deleteR();
    } else if (x == 3) {
        listR();
    } else if (x == 4) {
        searchR();
    } else {
        console.log("Please input the number between one to five!");
        loopExcute();
    }

}


//输入记录的函数
function inputR(){
    console.log("If you do not want to input,please input 'no / NO' !");
    var id,clas,tel,name;
    while(1){
        name = prompt("姓名:");
        if(name != "no" && name != "NO"){
            var ob = new Object();
            ob.name = checkName(name);
            id = parseInt(prompt("学号:"));
            ob.id = checkID(id)
            clas = parseInt(prompt("班级:"));
            ob.class = checkClass(clas);
            tel = prompt("电话:");
            ob.tel = checkTel(tel);
            ob.chinese = prompt("语文:");
            ob.math = prompt("数学:");
            ob.english = prompt("英语:");
            infoArray[arrayNum] = ob;
            arrayNum++;
            console.log("Input Successful!\n");
        }
        else{
            break;
        }
    }
    loopExcute();
}
//删除记录的函数
function deleteR(){
    var IdNum = prompt("Please input the number you want to delete !");
    var i;
    for(i = 0 ; i<arrayNum; i++){
        if(infoArray[i].id == IdNum){
            infoArray.splice(i,1);
            //判断是否删除成功
            console.log("Delete Successful !");
            arrayNum--;
            loopExcute();
        }
    }
    if(i >= arrayNum){
        console.log("No destination you want to delete !");
        loopExcute();
    }
}


//输出记录的函数
function listR(){
    if(arrayNum>0){
        console.log("\t\t\t\t\t\t  STUDENTS INFOMATION TABLE");
        console.log("\t\t\t-------------------------------------------------------------------------------");
        console.log("\t\t\t|*  姓名  |   学号   |  班级  |      电话      |  语文  |  数学  |  英语  *|")
        console.log("\t\t\t-------------------------------------------------------------------------------");
        for(var i = 0 ; i < arrayNum ; i++){
            console.log("\t\t\t|*"+infoArray[i].name+"|"+infoArray[i].id+"|    "+infoArray[i].class+"   |  "+infoArray[i].tel+"  |    "+infoArray[i].chinese+"    |  "+infoArray[i].math+"   |     "+infoArray[i].english+"   *|");
            console.log("\t\t\t-------------------------------------------------------------------------------");
        }
        console.log("\n");
        loopExcute();
    }else{
        console.log("There is no any record !");
        console.log(arrayNum);
        loopExcute();
    }

}
function searchR(){
    var IdNum = prompt("Please input the id number you want to find !");
    findId(IdNum);
}

function findId(IdNum){
    var i = 0;
    var id,clas,tel;
    for(i = 0 ; i<arrayNum; i++){
        if(infoArray[i].id == IdNum){
            console.log("该生的信息为：\n");
            console.log("姓名:"+infoArray[i].name);
            console.log("学号:"+infoArray[i].id);
            console.log("班级:"+infoArray[i].class);
            console.log("电话:"+infoArray[i].tel);
            loopExcute();
        }
    }
    if(i >= arrayNum){
        console.log("未找到结果 !\n");
        var isInput = prompt("是否添加此id?(Y/N)");
        if(isInput == "Y" || isInput == "y"){
            var ob = new Object();
            var name = prompt("姓名:");
            ob.name = checkName(name);
            console.log("学号:");
            console.log(IdNum);
            ob.id = IdNum;
            clas = prompt("班级:");
            ob.class = checkClass(clas);
            tel = prompt("电话:");
            ob.tel = checkTel(tel);
            ob.chinese = prompt("语文:");
            ob.math = prompt("数学:");
            ob.english = prompt("英语:");
            infoArray[arrayNum] = ob;
            arrayNum++;
            console.log("Input Successful!\n");
            loopExcute();
        }else{
            loopExcute();
        }
    }
}


function checkName(name){
    var isCharactor = false;
    for(var i = 0 ; i<name.length ; i++){
        if(!((name[i] >= "a" && name[i] <= "z")||(name[i] >= "A" && name[i] <= "Z"))){
            isCharactor = true;
        }
    }
    if (!isCharactor) {
        console.log("Name must be contained by a~z / A~Z !");
        name = prompt("姓名:");
        if(name == "no" && name == "NO"){
            loopExcute();
        }
        checkName(name);
    }
    return name;
}


function checkID(id){
    var idString = String(id);
    var isnum = false;
    for(var i = 0 ;i<idString.length;i++){
        if(!(idString[i] >=0 && idString[i]<=9)){
            isnum = true;
        }
    }
    if(!isnum){
        console.log("The id must be contained by 0~9 !");
        id = prompt("学号:");
        checkID(id);
    }
    return id;
}


function checkClass(clas){
    if(!(clas >= 0 && clas <= 9)){
        console.log("The class must be contained by 0~9 !");
        clas = prompt("班级:");
        checkClass(clas);
    }
    return clas;
}
function checkTel(tel){
    var telPhone = String(tel);
    var isEven;
    var isNum;
    for(var i = 0; i<telPhone.length ;i++){
        if(telPhone.length == 11){
            isEven = true;
        }
        if(!(telPhone[i]>=0 && telPhone[i]<=9)){
            isNum = true;
        }
    }
    if(!isEven) {
        if (!isNum) {
            console.log("The telPhone number must be contained by 0~9");
            tel = prompt("number:");
            checkTel(tel);
        } else {
            console.log("The telPhone number must have 11 numbers!");
            tel = prompt("number:");
            checkTel(tel);
        }
    }
    return tel;
}
headOuput();
loopExcute();