var stuPlace = -1;//全局变量，用于记录需要删除节点的位置

//************************************************存储一个默认的学生对象********************************************************
var stuExample = {
    id: 1606000000,
    name: "张三",
    sex: "男",
    grade: 2016,
    major: "计算机科学与技术"
};
var stuList = [stuExample];
localStorage.setItem("stuList", JSON.stringify(stuList));

//**************************************************隐藏其他的表单**************************************************************

function inputShow() {
    //*****************************隐藏所有其他表单*****************************
    document.getElementById("stu-input").style.display = "";
    document.getElementById("stu-search").style.display = "none";
    document.getElementById("stu-change").style.display = "none";
    document.getElementById("stu-list").style.display = "none";
    document.getElementById("stu-delete").style.display = "none";

    //*****************************隐藏所有提示标签******************************
    document.getElementById("stu-input-warningId").style.display = "none";
    document.getElementById("stu-input-warningName").style.display = "none";
    document.getElementById("stu-input-warningGrade").style.display = "none";
    document.getElementById("stu-input-warningMajor").style.display = "none";
    document.getElementById("stu-input-warningSex").style.display = "none";

    //****************************清空输入框内容*******************************
    document.getElementById("inputID").value = "";
    document.getElementById("inputName").value = "";
    document.getElementById("inputGrade").value = "";
    document.getElementById("inputMajor").value = "";
}


function searchShow() {
    //*****************************隐藏所有其他表单*****************************
    document.getElementById("stu-input").style.display = "none";
    document.getElementById("stu-search").style.display = "";
    document.getElementById("stu-change").style.display = "none";
    document.getElementById("stu-list").style.display = "none";
    document.getElementById("stu-delete").style.display = "none";

    //****************************隐藏所有无关标签*******************************
    document.getElementById("stu-search-warning").style.display = "none";
    document.getElementById("stu-search-notFound").style.display = "none";
    document.getElementById("stu-search-show").style.display = "none";

    //****************************清空输入框内容*******************************
    document.getElementById("searchID").value = "";
}


function changeShow() {
    //*****************************隐藏所有其他表单*****************************
    document.getElementById("stu-input").style.display = "none";
    document.getElementById("stu-search").style.display = "none";
    document.getElementById("stu-change").style.display = "";
    document.getElementById("stu-list").style.display = "none";
    document.getElementById("stu-delete").style.display = "none";

    //****************************隐藏所有无关标签*******************************
    document.getElementById("stu-change-warning").style.display = "none";
    document.getElementById("stu-change-notFound").style.display = "none";
    document.getElementById("stu-change-show").style.display = "none";
    document.getElementById("stu-change-change").style.display = "none";

    //****************************清空输入框内容*******************************
    document.getElementById("changeID-search").value = "";

    //***************************还原全局变量的值*******************************
    stuPlace = -1;

}


function listShow() {
    //*****************************隐藏所有其他表单*****************************
    document.getElementById("stu-input").style.display = "none";
    document.getElementById("stu-search").style.display = "none";
    document.getElementById("stu-change").style.display = "none";
    document.getElementById("stu-list").style.display = "";
    document.getElementById("stu-delete").style.display = "none";

    //****************************隐藏所有无关标签*******************************
    document.getElementById("stu-list-notFound").style.display = "none";
    document.getElementById("stu-list-show").style.display = "none";

}


function deleteShow() {
    //*****************************隐藏所有其他表单*****************************
    document.getElementById("stu-input").style.display = "none";
    document.getElementById("stu-search").style.display = "none";
    document.getElementById("stu-change").style.display = "none";
    document.getElementById("stu-list").style.display = "none";
    document.getElementById("stu-delete").style.display = "";

    //*************************隐藏所有的消息框**************************
    document.getElementById("stu-delete-notFound").style.display = "none";//隐藏警示栏
    document.getElementById("stu-delete-warning").style.display = "none";//隐藏提示标签
    document.getElementById("stu-delete-show").style.display = "none";//隐藏信息栏
    document.getElementById("stu-delete-check").style.display = "none";//隐藏确认栏

    //*************************清空搜索栏*******************************
    document.getElementById("deleteID-search").value = "";

    //***************************还原全局变量的值*******************************
    stuPlace = -1;

}

//****************************************************添加学生信息*************************************************************
function stuInput() {
    //*****************************获取表单元素************************************
    var stuId = document.getElementById("inputID").value;
    var stuName = document.getElementById("inputName").value;
    var stuGrade = document.getElementById("inputGrade").value;
    var stuMajor = document.getElementById("inputMajor").value;
    var sex = document.getElementsByName("sex");
    var stuSex;
    if (sex[0].checked) {
        stuSex = "男";
    } else if (sex[1].checked) {
        stuSex = "女";
    }

    //*****************************隐藏所有提示标签******************************
    document.getElementById("stu-input-warningId").style.display = "none";
    document.getElementById("stu-input-warningName").style.display = "none";
    document.getElementById("stu-input-warningGrade").style.display = "none";
    document.getElementById("stu-input-warningMajor").style.display = "none";
    document.getElementById("stu-input-warningSex").style.display = "none";

    //*****************************对表单元素进行判断********************************
    //用于判断表单是否填满
    var isContain = true;

    //用于判断表单是否符合要求
    var isValue = true;

    //判断表单是否为空,然后再判断输入格式是否正确

    if (stuId == "") {
        document.getElementById("stu-input-warningId").style.display = "";
        document.getElementById("stu-input-warningId").innerText = "未填写学号！";
        isContain = false;
    } else if (!checkID(stuId)) {
        document.getElementById("stu-input-warningId").style.display = "";
        document.getElementById("stu-input-warningId").innerText = "学号格式不正确！";
        isValue = false;
    } else if (!existID(stuId)) {
        document.getElementById("stu-input-warningId").style.display = "";
        document.getElementById("stu-input-warningId").innerText = "添加的信息已存在！";
        isContain = false;
    }//通过id检查是否重复输入

    if (stuName == "") {
        document.getElementById("stu-input-warningName").style.display = "";
        document.getElementById("stu-input-warningName").innerText = "未填写姓名！";
        isContain = false;
    }

    if (stuGrade == "") {
        document.getElementById("stu-input-warningGrade").style.display = "";
        document.getElementById("stu-input-warningGrade").innerText = "未填写年级！";
        isContain = false;
    }

    if (stuMajor == "") {
        document.getElementById("stu-input-warningMajor").style.display = "";
        document.getElementById("stu-input-warningMajor").innerText = "未填写专业！";
        isContain = false;
    }

    if (stuSex == "") {
        document.getElementById("stu-input-warningSex").style.display = "";
        document.getElementById("stu-input-warningSex").innerText = "未选择性别！";
        isContain = false;
    }

    //***************************存储表单元素********************************
    if (isContain && isValue) {
        var student = {
            id: stuId,
            name: stuName,
            sex: stuSex,
            grade: stuGrade,
            major: stuMajor
        };
        var newStuList = JSON.parse(localStorage.getItem("stuList"));
        newStuList.push(student);
        localStorage.setItem("stuList", JSON.stringify(newStuList));
        alert("成功添加新信息！");

        //*********************隐藏所有提示标签*******************
        document.getElementById("stu-input-warningId").style.display = "none";
        document.getElementById("stu-input-warningName").style.display = "none";
        document.getElementById("stu-input-warningGrade").style.display = "none";
        document.getElementById("stu-input-warningMajor").style.display = "none";
        document.getElementById("stu-input-warningSex").style.display = "none";

        //*********************清空输入框内容**********************
        document.getElementById("inputID").value = "";
        document.getElementById("inputName").value = "";
        document.getElementById("inputGrade").value = "";
        document.getElementById("inputMajor").value = "";
    }
}

//****************************************************搜索学生信息*************************************************************
function stuSearch() {
    //*****************************获取搜索框元素********************************
    var stuId = document.getElementById("searchID").value;

    //*****************************对搜索框元素进行判断***************************
    //用于判断表单是否填满
    var isContain = true;

    //用于判断表单是否符合要求
    var isValue = true;

    //判断表单是否为空,然后再判断输入格式是否正确

    if (stuId == "") {
        document.getElementById("stu-search-show").style.display = "none";//隐藏信息栏
        document.getElementById("stu-search-notFound").style.display = "none";//隐藏警示栏
        document.getElementById("stu-search-warning").style.display = "";
        document.getElementById("stu-search-warning").innerText = "未填写学号！";
        isContain = false;
    } else if (!checkID(stuId)) {
        document.getElementById("stu-search-show").style.display = "none";//隐藏信息栏
        document.getElementById("stu-search-notFound").style.display = "none";//隐藏警示栏
        document.getElementById("stu-search-warning").style.display = "";
        document.getElementById("stu-search-warning").innerText = "学号格式不正确！";
        isValue = false;
    }

    //**********************************查找学生id***********************************
    if (isContain && isValue) {
        var searchStuList = JSON.parse(localStorage.getItem("stuList"));
        var student;
        var number = -1;    //number用于记录被搜索信息的位置
        for (var i = 0; i < searchStuList.length; i++) {
            if (stuId == searchStuList[i].id) {
                number = i;
            }
        }
        if (number == -1) {
            //如果没有找到，则做出提示
            document.getElementById("stu-search-notFound").style.display = "";//显示警示栏
            document.getElementById("stu-search-warning").style.display = "none";//隐藏提示标签
            document.getElementById("stu-search-show").style.display = "none";//隐藏信息栏
        } else {
            //如果找到了，则将该对象赋值给student
            student = searchStuList[number];
            document.getElementById("stu-search-warning").style.display = "none";//隐藏提示标签
            document.getElementById("stu-search-notFound").style.display = "none";//隐藏警示栏
            document.getElementById("stu-search-show").style.display = "";//显示信息栏
            document.getElementById("stu-search-show-tbody").innerHTML = "<tr><td>" + student.id + "</td><td>" + student.name + "</td><td>" + student.sex + "</td><td>" + student.grade + "</td><td>" + student.major + "</td></tr>";
        }
    }
}

//****************************************************修改学生信息*************************************************************

//*******************************先搜索所需修改学生的信息***************************************
function stuChangeShow() {
    //*****************************获取搜索框元素********************************
    var stuId = document.getElementById("changeID-search").value;

    //*****************************对搜索框元素进行判断***************************
    //用于判断表单是否填满
    var isContain = true;

    //用于判断表单是否符合要求
    var isValue = true;

    //判断表单是否为空,然后再判断输入格式是否正确

    if (stuId == "") {
        document.getElementById("stu-change-notFound").style.display = "none";//隐藏警示栏
        document.getElementById("stu-change-show").style.display = "none";//隐藏信息栏
        document.getElementById("stu-change-change").style.display = "none";//隐藏修改栏
        document.getElementById("stu-change-warning").style.display = "";
        document.getElementById("stu-change-warning").innerText = "未填写学号！";
        isContain = false;
    } else if (!checkID(stuId)) {
        document.getElementById("stu-change-notFound").style.display = "none";//隐藏警示栏
        document.getElementById("stu-change-show").style.display = "none";//隐藏信息栏
        document.getElementById("stu-change-change").style.display = "none";//隐藏修改栏
        document.getElementById("stu-change-warning").style.display = "";
        document.getElementById("stu-change-warning").innerText = "学号格式不正确！";
        isValue = false;
    }

    //**********************************查找学生id***********************************
    if (isContain && isValue) {
        var changeStuList = JSON.parse(localStorage.getItem("stuList"));
        var student;
        var number = -1;    //number用于记录被搜索信息的位置
        for (var i = 0; i < changeStuList.length; i++) {
            if (stuId == changeStuList[i].id) {
                number = i;
            }
        }
        if (number == -1) {
            //如果没有找到，则做出提示
            document.getElementById("stu-change-notFound").style.display = "";//显示警示栏
            document.getElementById("stu-change-warning").style.display = "none";//隐藏提示标签
            document.getElementById("stu-change-show").style.display = "none";//隐藏信息栏
            document.getElementById("stu-change-change").style.display = "none";//隐藏修改栏
        } else {
            //如果找到了，则将该对象赋值给student
            student = changeStuList[number];
            document.getElementById("stu-change-warning").style.display = "none";//隐藏提示标签
            document.getElementById("stu-change-notFound").style.display = "none";//隐藏警示栏
            document.getElementById("stu-change-show").style.display = "";//显示信息栏
            document.getElementById("stu-change-show-tbody").innerHTML = "<tr><td>" + student.id + "</td><td>" + student.name + "</td><td>" + student.sex + "</td><td>" + student.grade + "</td><td>" + student.major + "</td></tr>";
            //**********************************修改学生信息***********************************
            document.getElementById("stu-change-change").style.display = "";//显示修改栏

            //****************先将信息预先填入表中*****************
            document.getElementById("changeID").value = student.id;
            document.getElementById("changeName").value = student.name;
            document.getElementById("changeGrade").value = student.grade;
            document.getElementById("changeMajor").value = student.major;

            //****************记录此时的number，便于删除节点*****************
            stuPlace = number;//全局变量
        }
    }
}

//************************************修改学生的信息***************************************
function stuChangeChange() {

    //****************获取表单元素************************
    var stuId = document.getElementById("changeID").value;
    var stuName = document.getElementById("changeName").value;
    var stuGrade = document.getElementById("changeGrade").value;
    var stuMajor = document.getElementById("changeMajor").value;
    var sex = document.getElementsByName("changeSex");
    var stuSex;
    if (sex[0].checked) {
        stuSex = "男";
    } else if (sex[1].checked) {
        stuSex = "女";
    }

    //****************对表单元素进行判断********************
    //用于判断表单是否填满
    var isContain = true;

    //用于判断表单是否符合要求
    var isValue = true;

    //判断表单是否为空,然后再判断输入格式是否正确

    if (stuId == "") {
        document.getElementById("stu-change-warningId").style.display = "";
        document.getElementById("stu-change-warningId").innerText = "未填写学号！";
        isContain = false;
    } else if (!checkID(stuId)) {
        document.getElementById("stu-change-warningId").style.display = "";
        document.getElementById("stu-change-warningId").innerText = "学号格式不正确！";
        isValue = false;
    }

    if (stuName == "") {
        document.getElementById("stu-change-warningName").style.display = "";
        document.getElementById("stu-change-warningName").innerText = "未填写姓名！";
        isContain = false;
    }

    if (stuGrade == "") {
        document.getElementById("stu-change-warningGrade").style.display = "";
        document.getElementById("stu-change-warningGrade").innerText = "未填写年级！";
        isContain = false;
    }

    if (stuMajor == "") {
        document.getElementById("stu-change-warningMajor").style.display = "";
        document.getElementById("stu-change-warningMajor").innerText = "未填写专业！";
        isContain = false;
    }

    if (stuSex == "") {
        document.getElementById("stu-change-warningSex").style.display = "";
        document.getElementById("stu-change-warningSex").innerText = "未选择性别！";
        isContain = false;
    }

    //****************存储表单元素********************
    if (isContain && isValue) {
        var changeStuList = JSON.parse(localStorage.getItem("stuList"));
        if (stuId == changeStuList[stuPlace].id) {//id未被修改
            changeStuList[stuPlace].id = stuId;
            changeStuList[stuPlace].name = stuName;
            changeStuList[stuPlace].sex = stuSex;
            changeStuList[stuPlace].grade = stuGrade;
            changeStuList[stuPlace].major = stuMajor;
            localStorage.setItem("stuList", JSON.stringify(changeStuList));
            alert("信息已成功修改！");
        } else { // id被修改
            var student = {
                id: stuId,
                name: stuName,
                sex: stuSex,
                grade: stuGrade,
                major: stuMajor
            };
            changeStuList.push(student);//添加新元素
            changeStuList.splice(stuPlace, 1);//把原有元素删除
            localStorage.setItem("stuList", JSON.stringify(changeStuList));
            alert("信息已成功修改！");
        }
    }
}

//****************************************************打印所有学生信息*********************************************************
function stuListShow() {

    var listStuList = JSON.parse(localStorage.getItem("stuList"));
    if (listStuList[0] == null) {      //如果对象数组内不含任何对象
        document.getElementById("stu-list-notFound").style.display = "";//做出警示
    } else {     //如果数组内含有对象
        document.getElementById("stu-list-show").style.display = "";
        var table = ""; //显示在table里的字符
        var tableAdd;//用于追加table的字符

        for (var i = 0; i < listStuList.length; i++) {
            table += "<tr><td>" + listStuList[i].id + "</td><td>" + listStuList[i].name + "</td><td>" + listStuList[i].sex + "</td><td>" + listStuList[i].grade + "</td><td>" + listStuList[i].major + "</td></tr>";
        }
        document.getElementById("stu-list-show-tbody").innerHTML = table;
    }
}

//****************************************************删除学生信息*********************************************************

//*******************************先搜索需删除学生的信息***************************************
function stuDeleteShow() {
    //*****************************获取搜索框元素********************************
    var stuId = document.getElementById("deleteID-search").value;

    //*****************************对搜索框元素进行判断***************************
    //用于判断表单是否填满
    var isContain = true;

    //用于判断表单是否符合要求
    var isValue = true;

    //判断表单是否为空,然后再判断输入格式是否正确

    if (stuId == "") {
        document.getElementById("stu-delete-notFound").style.display = "none";//隐藏警示栏
        document.getElementById("stu-delete-show").style.display = "none";//隐藏信息栏
        document.getElementById("stu-delete-check").style.display = "none";//隐藏确认栏
        document.getElementById("stu-delete-warning").style.display = "";
        document.getElementById("stu-delete-warning").innerText = "未填写学号！";
        isContain = false;
    } else if (!checkID(stuId)) {
        document.getElementById("stu-delete-notFound").style.display = "none";//隐藏警示栏
        document.getElementById("stu-delete-show").style.display = "none";//隐藏信息栏
        document.getElementById("stu-delete-check").style.display = "none";//隐藏确认栏
        document.getElementById("stu-delete-warning").style.display = "";
        document.getElementById("stu-delete-warning").innerText = "学号格式不正确！";
        isValue = false;
    }

    //**********************************查找学生id***********************************
    if (isContain && isValue) {
        var deleteStuList = JSON.parse(localStorage.getItem("stuList"));
        var student;
        var number = -1;    //number用于记录被搜索信息的位置
        for (var i = 0; i < deleteStuList.length; i++) {
            if (stuId == deleteStuList[i].id) {
                number = i;
                break;
            }
        }
        if (number == -1) {
            //如果没有找到，则做出提示
            document.getElementById("stu-delete-notFound").style.display = "";//显示警示栏
            document.getElementById("stu-delete-warning").style.display = "none";//隐藏提示标签
            document.getElementById("stu-delete-show").style.display = "none";//隐藏信息栏
            document.getElementById("stu-delete-check").style.display = "none";//隐藏确认栏
        } else {
            //如果找到了，则将该对象赋值给student
            student = deleteStuList[number];
            document.getElementById("stu-delete-warning").style.display = "none";//隐藏提示标签
            document.getElementById("stu-delete-notFound").style.display = "none";//隐藏警示栏
            document.getElementById("stu-delete-show").style.display = "";//显示信息栏
            document.getElementById("stu-delete-show-tbody").innerHTML = "<tr><td>" + student.id + "</td><td>" + student.name + "</td><td>" + student.sex + "</td><td>" + student.grade + "</td><td>" + student.major + "</td></tr>";
            //**********************************确认删除学生信息***********************************
            document.getElementById("stu-delete-check").style.display = "";//显示确认栏

            //****************记录此时的number，便于删除节点*****************
            stuPlace = number;//全局变量
        }
    }
}

//*******************************************确认删除学生的信息***************************************
function stuDeleteCheck() {
    var deleteStuList = JSON.parse(localStorage.getItem("stuList"));
    deleteStuList.splice(stuPlace, 1);//把元素删除
    localStorage.setItem("stuList", JSON.stringify(deleteStuList));
    alert("信息已成功删除！");

    //*************************隐藏所有的消息框**************************
    document.getElementById("stu-delete-notFound").style.display = "none";//隐藏警示栏
    document.getElementById("stu-delete-warning").style.display = "none";//隐藏提示标签
    document.getElementById("stu-delete-show").style.display = "none";//隐藏信息栏
    document.getElementById("stu-delete-check").style.display = "none";//隐藏确认栏

    //*************************清空搜索栏*******************************
    document.getElementById("deleteID-search").value = "";
}

//*******************************************取消删除学生的信息***************************************
function stuDeleteCancel() {
    //*************************隐藏所有的消息框**************************
    document.getElementById("stu-delete-notFound").style.display = "none";//隐藏警示栏
    document.getElementById("stu-delete-warning").style.display = "none";//隐藏提示标签
    document.getElementById("stu-delete-show").style.display = "none";//隐藏信息栏
    document.getElementById("stu-delete-check").style.display = "none";//隐藏确认栏

    //*************************清空搜索栏*******************************
    document.getElementById("deleteID-search").value = "";

}

//**************************************************以下实现相应方法************************************************************

//判断id是否符合格式
function checkID(id) {
    var idString = String(id);
    if (idString.length != 10) {
        return false;
    } else {
        for (var i = 0; i < idString.length; i++) {
            if (!(idString[i] >= 0 && idString[i] <= 9)) {
                return false;
            }
        }
        return true;
    }

}

//判断id是否已经添加过
function existID(id) {
    var existStuList = JSON.parse(localStorage.getItem("stuList"));
    for (each in existStuList) {
        if (id == existStuList[each].id) {
            return false;
        }
    }
    return true;
}
