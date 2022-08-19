
$(function(){


// *** APIs ***
// clima, previsão 12 horas e previsão 5 dias: https://developer.accuweather.com/apis
// pegar coordenadas geográficas pelo nome da cidade: https://docs.mapbox.com/api/
// pegar coordenadas do IP: http://www.geoplugin.net
// gerar gráficos em JS: https://www.highcharts.com/demo

//"http://dataservice.accuweather.com/currentconditions/v1/28143?apikey=uCxMse7d3LYuSZilEeRXALh1BK9Qw6ce&language=pt-br"
var accuWeatherAPIKey = "uCxMse7d3LYuSZilEeRXALh1BK9Qw6ce"

var weatherObject = 
{
    cidade: "",
    estado: "",
    pais: "",
    temperatura: "",
    texto_clima: "",
    icone_clima: "",
};

function preencherClima(cidade, estado, pais, temperatura, texto_clima, icone_clima)
{
    var texto_local = cidade + ". " + estado + ". "  + pais;
    $("#texto_local").text(texto_local);

    $("#texto_clima").text(texto_clima);

    $("#texto_temperatura").html( String(temperatura) + "&deg" );

    $("#icone_clima").css("background-image", "url('" + weatherObject.icone_clima + "')");
}

function preencherPrevisao5Dias(previsoes) 
{
    $("#info_5dias").html("");

    var diaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado",]

    for (var a = 0; a < previsoes.length; a++)
    {
        var dataHoje = new Date(previsoes[a].Date);

        var dia_semana = diaSemana[dataHoje.getDay()];

        var iconNumber = previsoes[a].Day.Icon <= 9 ? "0" + String(previsoes[a].Day.Icon) : String(previsoes[a].Day.Icon);

        iconeClima = "https://developer.accuweather.com/sites/default/files/" + iconNumber + "-s.png";
        maxima = String(previsoes[a].Temperature.Maximum.Value);
        minima = String(previsoes[a].Temperature.Minimum.Value);

        elementoHTMLDia = '<div class="day col">';
        elementoHTMLDia +=  '<div class="day_inner">';
        elementoHTMLDia +=      '<div class="dayname">';
        elementoHTMLDia +=          dia_semana;
        elementoHTMLDia +=          '</div>';      
        elementoHTMLDia +=              '<div style="background-image: url(\' '+ iconeClima + '\')" class="daily_weather_icon"></div>';     
        elementoHTMLDia +=              '<div class="max_min_temp">';
        elementoHTMLDia +=              '' + minima + '&deg; / ' + maxima + '&deg;';
        elementoHTMLDia +=           '</div>';
        elementoHTMLDia +=         '</div>';
        elementoHTMLDia +=     '</div>';

        $("#info_5dias").append(elementoHTMLDia);

        elementoHTMLDia = "";

    }
}

function pegarPrevisao5Dias(localCode)
{
    //"http://dataservice.accuweather.com/forecasts/v1/daily/5day/28143?apikey=uCxMse7d3LYuSZilEeRXALh1BK9Qw6ce&language=pt-br"

    $.ajax(
        {
            url : "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + localCode + "?apikey=" + accuWeatherAPIKey + "&language=pt-br&metric=true",
            type: "GET",
            dataType: "json",
            success: function(data)
            {
                $("#texto_max_min").html( String(data.DailyForecasts[0].Temperature.Minimum.Value) + "&deg; /" + String(data.DailyForecasts[0].Temperature.Maximum.Value) + "&deg;");

                preencherPrevisao5Dias(data.DailyForecasts);
            },
            error: function()
            {
                console.log("Erro");
            }
        });
}

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

                weatherObject.temperatura = data[0].Temperature.Metric.Value;
                weatherObject.texto_clima = data[0].WeatherText;

                var iconNumber = data[0].WeatherIcon <= 9 ? "0" + String(data[0].WeatherIcon) : String(data[0].WeatherIcon);

                weatherObject.icone_clima = "https://developer.accuweather.com/sites/default/files/" + iconNumber + "-s.png";

                preencherClima(weatherObject.cidade, weatherObject.estado, weatherObject.pais, weatherObject.temperatura, weatherObject.texto_clima, weatherObject.icone_clima)
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
                try 
                {
                    weatherObject.cidade = data.ParentCity.LocalizedName;
                }
                catch
                {
                    weatherObject.cidade = data.LocalizedName;
                }
                
                weatherObject.estado = data.AdministrativeArea.LocalizedName;
                weatherObject.pais = data.Country.LocalizedName;

                var localCode = data.Key;
                pegarTempoAtual (localCode);
                pegarPrevisao5Dias(localCode)
                
            },
            error: function()
            {
                console.log("Erro");
            }
        });
}

//pegarLocalUsuario(-26.63839410954363, -49.11309933181075)

function pegarCoordenadasDoIP ()
{   
    var lat_padrao = -26.63839410954363;
    var long_padrao = -49.11309933181075;

    $.ajax(
        {
            url : "http://www.geoplugin.net/json.gp",
            type: "GET",
            dataType: "json",
            success: function(data)
            {               

                if (data.geoplugin_latitude && data.geoplugin_longitude)
                {
                    pegarLocalUsuario(data.geoplugin_latitude, data.geoplugin_longitude);
                }
                else
                {   
                    pegarLocalUsuario(lat_padrao, long_padrao);
                }                
                
            },
            error: function()
            {
                console.log("Erro");
                pegarLocalUsuario(lat_padrao, long_padrao);
            }
        });
}

pegarCoordenadasDoIP();

});