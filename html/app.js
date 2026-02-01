const hudSettings = document.getElementById("hud-settings")
const hud = document.getElementById("square-hud")

let settings = JSON.parse(localStorage.getItem("hudSettings")) || {
  position:"bottom",
  gradient:false,

  hpColor:"#ff0033",
  lossColor:"#555555",

  borderRadius:8,
  borderSize:2,
  borderEnabled:true,

  glowStrength:12,
  glowColor:"#ff0033",
  glowOpacity:0.35,

  grad1:"#ff0033",
  grad2:"#7a00ff",
  grad3:"#ff0033",

  hitColor:"#ffffff",
  hitOpacity:1,

  damageColor:"#ff0000",
  damageOpacity:1
}

let tempSettings = {...settings}
applySettings()

document.querySelectorAll(".tab").forEach(tab=>{
  tab.onclick=()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"))
    document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"))
    tab.classList.add("active")
    document.getElementById(tab.dataset.tab).classList.add("active")
  }
})

document.querySelectorAll(".choice").forEach(c=>{
  c.onclick=()=>{
    document
      .querySelectorAll(`.choice[data-target="${c.dataset.target}"]`)
      .forEach(x=>x.classList.remove("active"))

    c.classList.add("active")
    tempSettings[c.dataset.target]=c.dataset.value
    applyPreview()
  }
})

document.querySelectorAll(".toggle").forEach(t=>{
  t.onclick=()=>{
    t.classList.toggle("active")
    tempSettings[t.dataset.target]=t.classList.contains("active")
    updateGradientUI()
    applyPreview()
  }
})

document.querySelectorAll("#hud-settings input").forEach(i=>{
  i.oninput=()=>{
    tempSettings[i.id]=i.type==="range"?Number(i.value):i.value
    applyPreview()
  }
})

window.addEventListener("message",e=>{
  const d=e.data

  if(d.action==="openSettings"){
    hudSettings.classList.remove("hidden")
    tempSettings={...settings}
    loadUI()
    updateGradientUI()
    applyPreview()
  }

  if(d.action==="applySettings"){
    settings=d.settings
    localStorage.setItem("hudSettings",JSON.stringify(settings))
    applySettings()
    hudSettings.classList.add("hidden")
  }

  if(d.action==="update"){
    document.querySelector(".hp-loss").style.height=`${100-d.hp}%`
  }

  if(d.action==="hitmarker"){
    const h=document.getElementById("hitmarker")
    h.style.opacity=settings.hitOpacity
    setTimeout(()=>h.style.opacity=0,120)
  }
})

document.getElementById("save").onclick=()=>{
  settings={...tempSettings}
  localStorage.setItem("hudSettings",JSON.stringify(settings))

  fetch(`https://${GetParentResourceName()}/saveSettings`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(settings)
  })
}

function applySettings(){
  hud.className=settings.position

  document.querySelectorAll(".square").forEach(s=>{
    s.classList.toggle("gradient",settings.gradient)

    s.style.setProperty("--c",settings.hpColor)
    s.style.setProperty("--lossColor",settings.lossColor)

    s.style.setProperty("--g1",settings.grad1)
    s.style.setProperty("--g2",settings.grad2)
    s.style.setProperty("--g3",settings.grad3)

    s.style.setProperty("--borderSize",settings.borderSize+"px")
    s.style.setProperty("--radius",settings.borderRadius+"px")
    s.style.setProperty("--borderDisplay",settings.borderEnabled?"block":"none")

    s.style.boxShadow=
      `0 0 ${settings.glowStrength}px rgba(${hex(settings.glowColor)},${settings.glowOpacity})`
  })

  document.documentElement.style.setProperty("--hitColor",settings.hitColor)
  document.documentElement.style.setProperty("--hitOpacity",settings.hitOpacity)
  document.documentElement.style.setProperty("--damageColor",settings.damageColor)
  document.documentElement.style.setProperty("--damageOpacity",settings.damageOpacity)
}

function applyPreview(){
  document.querySelectorAll(".preview-hud .square").forEach(p=>{
    p.classList.toggle("gradient",tempSettings.gradient)

    p.style.setProperty("--c",tempSettings.hpColor)
    p.style.setProperty("--g1",tempSettings.grad1)
    p.style.setProperty("--g2",tempSettings.grad2)
    p.style.setProperty("--g3",tempSettings.grad3)

    p.style.setProperty("--borderSize",tempSettings.borderSize+"px")
    p.style.setProperty("--radius",tempSettings.borderRadius+"px")
    p.style.setProperty("--borderDisplay",tempSettings.borderEnabled?"block":"none")

    p.style.boxShadow=
      `0 0 ${tempSettings.glowStrength}px rgba(${hex(tempSettings.glowColor)},${tempSettings.glowOpacity})`
  })
}

function loadUI(){
  positionButtons()

  document
    .querySelector('.toggle[data-target="gradient"]')
    .classList.toggle("active",tempSettings.gradient)

  document
    .querySelector('.toggle[data-target="borderEnabled"]')
    .classList.toggle("active",tempSettings.borderEnabled)

  hpColor.value=tempSettings.hpColor
  lossColor.value=tempSettings.lossColor
  borderRadius.value=tempSettings.borderRadius
  borderSize.value=tempSettings.borderSize

  glowStrength.value=tempSettings.glowStrength
  glowColor.value=tempSettings.glowColor
  glowOpacity.value=tempSettings.glowOpacity

  grad1.value=tempSettings.grad1
  grad2.value=tempSettings.grad2
  grad3.value=tempSettings.grad3

  hitColor.value=tempSettings.hitColor
  hitOpacity.value=tempSettings.hitOpacity
  damageColor.value=tempSettings.damageColor
  damageOpacity.value=tempSettings.damageOpacity
}

function positionButtons(){
  document.querySelectorAll('.choice[data-target="position"]').forEach(b=>{
    b.classList.toggle("active",b.dataset.value===tempSettings.position)
  })
}

function updateGradientUI(){
  const box=document.querySelector(".gradient-options")
  if(box) box.classList.toggle("active",tempSettings.gradient)
}

function hex(h){
  const b=parseInt(h.replace("#",""),16)
  return `${(b>>16)&255},${(b>>8)&255},${b&255}`
}
