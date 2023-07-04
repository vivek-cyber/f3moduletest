
var btn1=document.getElementById("btn1")
btn1.addEventListener("click",func1)
var lat=document.getElementById("lat")
var long=document.getElementById("long")
var city=document.getElementById("city")
var org=document.getElementById("org")
var region=document.getElementById("region")
var hanme=document.getElementById("hname")
var gmap=document.getElementById("gmap")
var timezone=document.getElementById("Timezone")
var dandt=document.getElementById("dandt")
var pincode=document.getElementById("pincode")
var message=document.getElementById("message")
var postlist=document.getElementById("postlist")
var searchbox=document.getElementById("postsearch")

//async function to load ipaddress on screen 
async function func1()
{
   var response=loadip("https://ipinfo.io/json?token=76211b877f1f7b")
   response.then(getipinfo)
   response.catch(()=>{console.log("could not get Ip address")})
    btn1.style.visibility = 'hidden'
    document.getElementById("result").style.display="block"
    searchbox.addEventListener("keyup",debounceapifun)
}

//async function to fetch data from any url and convert it into json object and return a promise(json)
async function loadip(url)
{
    var response1=await fetch(url) 
    var response2=response1.json()
    return response2
}


//display the info we extracted using ip 
function getipinfo(data)
{
    console.log(data)
    var IP=data.ip
    console.log(IP)
    var cordinates=data.loc.split(",")
    console.log(cordinates)
    lat.innerText=lat.innerText+" "+cordinates[0]
    long.innerText+=" "+cordinates[1]
    city.innerText+=" "+data.city
    org.innerText+=" "+data.org
    region.innerText+=" "+data.region
    hanme.innerText+=" "+location.hostname
    gmap.src=`https://maps.google.com/maps?q=${cordinates[0]},${cordinates[1]}&z=15&output=embed`

    
    var currenttime = new Date().toLocaleString("en-US", { timeZone:data.timezone });
    gettimezone(currenttime,data.timezone,data.postal)
}

//display timezone and get current time in that timezone

function gettimezone(timez,tzone,pcode)
{
    console.log(timez)
    timezone.innerText=" "+tzone
    dandt.innerText=" "+timez
    pincode.innerText=pcode

    var postalprom=loadip(`https://api.postalpincode.in/pincode/${pcode}`)
    postalprom.then(postaldata)
    message.innerText=""
    postalprom.catch(()=>{console.log("could not get postal data")})
}

//function to get postofficelist
 var postofficelist


function postaldata(data)
{
    postofficelist=data[0].PostOffice
    message.innerText="Number of Postoffices found "+postofficelist.length
    console.log(postofficelist)

    displaylist(postofficelist)
}


//display the postal list any postal list given to it in arguments
function displaylist(list)
{

postlist.innerHTML=""

for(i of list)
{
    let tempdiv=document.createElement("div")
    tempdiv.innerHTML='<div><div id="ipinfo3">Name:</div><div id="name">'+i.Name+'</div></div><div><div id="ipinfo3">Branch Type: </div><div id="branch">'+i.BranchType+'</div></div><div><div id="ipinfo3">Delivery:</div><div id="deli">'+i.DeliveryStatus+'</div></div><div><div id="ipinfo3">District:</div><div id="district">'+i.District+'</div></div><div><div id="ipinfo3">Division:</div><div id="division">'+i.Division+'</div></div>'
    tempdiv.id="item"
    document.getElementById("postlist").appendChild(tempdiv)
}

}
var timeout
function debounceapifun(event)
{
  clearTimeout(timeout)
  timeout=setTimeout(searchingfunction,400,event.target.value);

}
//implement post office search in given area using name or branch type
function searchingfunction(val)
{
    if(val.trim()=="")
  {
    displaylist(postofficelist)
    console.log("nothing")
  }
  else
  {
    console.log("counted")
    var find=val
    var newlist=[]

    for(i of postofficelist)
    {
        if(i.Name.toLowerCase().includes(val.toLowerCase())||i.BranchType.toLowerCase().includes(val.toLowerCase()))
        {
            newlist.push(i)
        }
    }
    displaylist(newlist)
  }
}
