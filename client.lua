ESX = exports["es_extended"]:getSharedObject()

local lastHealth = 0

RegisterCommand("hudsettings", function()
    SetNuiFocus(true, true)
    SendNUIMessage({ action = "openSettings" })
end)

RegisterNUICallback("saveSettings", function(data, cb)
    SendNUIMessage({ action = "applySettings", settings = data })
    SetNuiFocus(false, false)
    cb("ok")
end)

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if not IsEntityDead(ped) then
            local hp = math.floor(((GetEntityHealth(ped) - 100) / 100) * 100)
            hp = math.max(0, math.min(100, hp))

            SendNUIMessage({
                action = "update",
                hp = hp,
                heading = GetEntityHeading(ped)
            })
        end
        Wait(200)
    end
end)

-- DAMAGE ARROWS
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local hp = GetEntityHealth(ped)

        if lastHealth ~= 0 and hp < lastHealth and not IsEntityDead(ped) then
            local cam = GetGameplayCamRot(2).z
            local diff = (cam - GetEntityHeading(ped) + 360) % 360

            local side = "top"
            if diff > 45 and diff <= 135 then side = "right"
            elseif diff > 135 and diff <= 225 then side = "bottom"
            elseif diff > 225 and diff <= 315 then side = "left" end

            SendNUIMessage({ action = "damageArrow", side = side })
        end

        lastHealth = hp
        Wait(50)
    end
end)

-- HITMARKER
AddEventHandler('gameEventTriggered', function(name, args)
    if name == 'CEventNetworkEntityDamage' then
        local victim = args[1]
        local attacker = args[2]

        if attacker == PlayerPedId() and DoesEntityExist(victim) and not IsEntityDead(victim) then
            SendNUIMessage({ action = "hitmarker" })
        end
    end
end)
-- haha 67 ale beka 

local sprawdz = nil
CreateThread(function()
    while true do
    Wait(200)
    local gracz = PlayerPedId()
    local waucie = IsPedInAnyVehicle(gracz, false)
    if waucie ~= sprawdz then
        DisplayRadar(waucie)
        sprawdz = waucie
    end
    end
end)

CreateThread(function()
    while true do
        Wait(0)

        HideHudComponentThisFrame(1)
        HideHudComponentThisFrame(2)
        HideHudComponentThisFrame(3)
        HideHudComponentThisFrame(4)
        HideHudComponentThisFrame(6)
        HideHudComponentThisFrame(7)
        HideHudComponentThisFrame(8)
        HideHudComponentThisFrame(9)
        HideHudComponentThisFrame(13)
        HideHudComponentThisFrame(14)
        HideHudComponentThisFrame(22)
    end
end)