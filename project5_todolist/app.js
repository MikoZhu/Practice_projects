let add = document.querySelector("form button")
let section = document.querySelector("section")
add.addEventListener("click", e => {

// prevent form from being submitted
    e.preventDefault()//如果点击click，就会把东西传出去，不希望发生，所以要用preventDefault

//get the input value
let form = e.target.parentElement //e.target is button, parentElement is form 
let todoText = form.children[0].value 
//选取input，type是text,.value是选择text中的value值（输入的text内容）
let todoMonth = form.children[1].value
let todoDate = form.children[2].value
if (todoText === ""){
    alert("Please enter some text.")
    return //return，表示这个calback function就结束了， 下面的程式码都不会出现。 如果没有return 则空白仍然会显示到下方的list中。 
}
//create a todo  
let todo = document.createElement("div")
todo.classList.add("todo")
let text = document.createElement("p")
text.classList.add("todo-text")
text.innerText = todoText
let time = document.createElement("p")
time.classList.add("todo-time")
time.innerText = todoMonth + " / " + todoDate

todo.appendChild(text)
todo.appendChild(time)
// creat green check 
let completeButton = document.createElement("button")
completeButton.classList.add("complete")
completeButton.innerHTML = "<i class='fa-solid fa-check'></i>"
completeButton.addEventListener("click", e => {
     //点击绿色的按钮时，避免按到i tag，从css中设定 pointer-envent
    let todoItem = e.target.parentElement
    todoItem.classList.toggle("done")//如果类值已存在，则移除它，否则添加它,如果里面有done就把它删掉，反之加进去
})
// creat red trash can
let trashButton = document.createElement("button")
trashButton.classList.add("trash")
trashButton.innerHTML = "<i class='fa-solid fa-trash'></i>"

trashButton.addEventListener ("click", e => {
    let todoItem = e.target.parentElement
    //console.log(e.target) - button, 我们需要让整个todo div消失
    //删除的时候仍然会有个空白在页面，所以用callback function
    todoItem.addEventListener("animationend", ()=>{
    //remove from local storage
    let text = todoItem.children[0].innerText
    let myListArray = JSON.parse(localStorage.getItem("list"))
    myListArray.forEach((item,index) =>{
        if (item.todoText = text){
            myListArray.splice(index,1)
            localStorage.setItem("list",JSON.stringify(myListArray))
        }
         })
        todoItem.remove()
    })  
    //console.log(todoItem)- 出现整个div todo
    todoItem.style.animation = "scaleDown 0.3s forwards"
})

todo.appendChild(completeButton)
todo.appendChild(trashButton)

todo.style.animation = "scaleUp 0.3s forwards"
// create an object 
let myTodo = {
    todoText: todoText,
    todoMonth:todoMonth,
    todoDate: todoDate
}
// store data into an array of an object 

let myList = localStorage.getItem("list")
if (myList == null){
    localStorage.setItem("list",JSON.stringify([myTodo])) 
    //如果之前就已经储存过了一些东西，本来就有些东西
} else{
    let myListArray = JSON.parse(myList)//换成array
    myListArray.push(myTodo) //push object to 这个list中
    localStorage.setItem("list",JSON.stringify(myListArray)) //最后set item，把这个新的list换成string的格式显示出来。 
}

console.log(JSON.parse(localStorage.getItem("list")))
form.children[0].value = "" //clear the text input

section.appendChild(todo)
})

function loadData(){
    let myList = localStorage.getItem("list")
if (myList !== null){
    let myListArray = JSON.parse(myList) //获得一个mylist array
    myListArray.forEach(item => {

        //create a todo
        let todo = document.createElement("div")
        todo.classList.add("todo")
        let text = document.createElement("p")
        text.classList.add("todo-text")
        text.innerText = item.todoText
        let time = document.createElement("p")
        time.classList.add("todo-time")
        time.innerText = item.todoMonth + " / " + item.todoDate
        todo.appendChild(text)
        todo.appendChild(time)

        // creat green check 
        let completeButton = document.createElement("button")
        completeButton.classList.add("complete")
        completeButton.innerHTML = "<i class='fa-solid fa-check'></i>"

        completeButton.addEventListener("click", e => {
            //点击绿色的按钮时，避免按到i tag，从css中设定 pointer-envent
           let todoItem = e.target.parentElement
           todoItem.classList.toggle("done")//如果类值已存在，则移除它，否则添加它,如果里面有done就把它删掉，反之加进去
       })
       // creat red trash can
       let trashButton = document.createElement("button")
       trashButton.classList.add("trash")
       trashButton.innerHTML = "<i class='fa-solid fa-trash'></i>"
       
       trashButton.addEventListener ("click", e => {
           let todoItem = e.target.parentElement
           //console.log(e.target) - button, 我们需要让整个todo div消失
           //删除的时候仍然会有个空白在页面，所以用callback function
           todoItem.addEventListener("animationend", ()=>{
                //remove from local storage
                let text = todoItem.children[0].innerText
                let myListArray = JSON.parse(localStorage.getItem("list"))
                myListArray.forEach((item,index) =>{
                    if (item.todoText = text){
                        myListArray.splice(index,1)
                        localStorage.setItem("list",JSON.stringify(myListArray))
                    }
                })
               todoItem.remove()
           })  
           //console.log(todoItem)- 出现整个div todo
           todoItem.style.animation = "scaleDown 0.3s forwards"
       })
        todo.appendChild(completeButton)
        todo.appendChild(trashButton)

        section.appendChild(todo)
    });
}

}

loadData()

function mergeTime(arr1,arr2){
    let result = []
    let i = 0
    let j = 0
  console.log('mergeTime:')
  console.log(arr1, arr2)
    while (i < arr1.length && j < arr2.length){
        if (Number(arr1[i].todoMonth) >Number(arr2[j].todoMonth)){
            result.push(arr2[j])
            j ++
        }else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i])
            i ++
        }else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                result.push (arr2[j])
                j ++
            }else {
                result.push(arr1[i])
                i ++
            }
        }
    }
    //如果剩下一些没有比较到的array，就要一下子放到result的array里面
    while (i < arr1.length){
        result.push(arr1[i])
        i++
    }
    while (j < arr2.length){
        result.push(arr2[j])
        j++
    }
    return result

}

function mergeSort (arr){
    console.log('mergesort:')
    console.log(arr)
    if (arr.length ==1){
        return arr
    }else {
        let middle = Math.floor(arr.length/2)
        let right = arr.slice(0,middle)
        let left = arr.slice (middle,arr.length)
        return mergeTime(mergeSort(right),mergeSort(left))
    }
}

// console.log(mergeSort(JSON.parse(localStorage.getItem("list")))) //parse以后变成一个真正的array

let sortButton = document.querySelector("div.sort button")
sortButton.addEventListener("click",()=>{
    //sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")))
    localStorage.setItem("list",JSON.stringify(sortedArray))

    // remove data
    let len = section.children.length //children 会回传一个html collection
    for (let i = 0; i < len; i ++){
        section.children[0].remove()
    }

    // load data 
    loadData()
})
