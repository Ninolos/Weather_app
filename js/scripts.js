
$(function(){


// *** APIs ***
// clima, previsão 12 horas e previsão 5 dias: https://developer.accuweather.com/apis
// pegar coordenadas geográficas pelo nome da cidade: https://docs.mapbox.com/api/
// pegar coordenadas do IP: http://www.geoplugin.net
// gerar gráficos em JS: https://www.highcharts.com/demo

//"http://dataservice.accuweather.com/currentconditions/v1/28143?apikey=uCxMse7d3LYuSZilEeRXALh1BK9Qw6ce&language=pt-br"
var accuWeatherAPIKey = "uCxMse7d3LYuSZilEeRXALh1BK9Qw6ce"

function pegarTempoAtual (localCode)
{
    $.ajax(
        {
            url : "http://dataservice.accuweather.com/currentconditions/v1/" + localCode + "?apikey=" + accuWeatherAPIKey + "&language=pt-br",
            type: "GET",
            dataType: "json",
            success: function(data)
            {
                console.log(data);
            },
            error: function()
            {
                console.log("Erro");
            }
        });
}

function pegarLocalUsuario (lat, long) 
{
    $.ajax(
        {
            url : "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + accuWeatherAPIKey + "&q=" + lat + "%2C%20" + long + "&language=pt-br",
            type: "GET",
            dataType: "json",
            success: function(data)
            {
                var localCode = data.Key;
                pegarTempoAtual (localCode)
                
            },
            error: function()
            {
                console.log("Erro");
            }
        });
}

pegarLocalUsuario(-26.63839410954363, -49.11309933181075)

});