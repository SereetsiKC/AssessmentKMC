

class Services {

    static async  calcBestPosibleRoutesPerVehicle(inputs) {
        return await new Promise(async (success, error) => {
            let results = {
                Car: "",
                Obit:""
            };
            try {

                let output = NaN;
                for (let item of inputs.VehicleWeatherCondition) {
                    let car = inputs.Vehicles.filter(x => x.id === item.vehicle_id)[0];
                    console.log(car);
                    for (let obit of inputs.Obits) {
                        let craters = obit.CratersToCross - ((inputs.WeatherCondition.reducer / 100) * obit.CratersToCross);
                        craters = obit.CratersToCross + ((inputs.WeatherCondition.increaser / 100) * obit.CratersToCross);
                        //time = distance /speed
                        let totaltime = obit.Distance / car.Speed;
                        if (StringHelper.StringCompare(car.Type, "Car")) {
                            totaltime = obit.Distance / obit.SpeedLimit;
                        }
                        console.log(`hours ${totaltime} for ${car.Type} on Obit ${obit.Name}`);
                        if (StringHelper.isDigitNaN(output)) {
                            output = totaltime;
                            results.Car = car.Type;
                            results.Obit = obit.Name;
                        } else {
                            if (output > totaltime) {
                                output = totaltime;
                                results.Car = car.Type;
                                results.Obit = obit.Name;
                            } else if (output === totaltime) {
                                if (StringHelper.StringCompare(results.Car, "Car") && StringHelper.StringCompare(car.Type, "Tuktuk")) {
                                    output = totaltime;
                                    results.Car = car.Type;
                                    results.Obit = obit.Name;
                                } else if (StringHelper.StringCompare(results.Car, "Tuktuk") && StringHelper.StringCompare(car.Type, "Bike")) {
                                    output = totaltime;
                                    results.Car = car.Type;
                                    results.Obit = obit.Name;
                                } else if (StringHelper.StringCompare(results.Car, "Car") && StringHelper.StringCompare(car.Type, "Bike")) {
                                    output = totaltime;
                                    results.Car = car.Type;
                                    results.Obit = obit.Name;
                                }
                            }
                        }
                    }
                }
                return await success(results);
            } catch (ex) {
                console.log(String(ex))
                return await success("");
            }
        });
    }

    static GetJSONDATA(object) {
        try {
            $.ajax({
                type: "GET",
                url: object.URL,
                data: object.DATA,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: (data) => {
                    object.CALLBACK(data);
                },
                error: (data) => {
                    object.ERROR(data);
                }
            });
        } catch (ex) {
            console.log(String(ex))
        }
    }

    static PostJSONDATA(object) {
        $.ajax({
            type: "POST",
            url: object.URL,
            data: object.DATA,
            dataType: "json",
            contentType: "application/json",
            success: (data) => {
                object.CALLBACK(data);
            },
            error: (data) => {
                console.log(data);
                object.ERROR(data);
            }
        });
    }
}


class StringHelper {

    static isNull(_data) {
        switch (true) {
            case (_data == 'null'):
            case (_data == 'NULL'):
            case (_data == null):
            case (_data == undefined):
            case (_data === ""): {
                return true;
                break;
            }
            default: {
                return false;
                break;
            }
        }
    }

    static isDigitNaN(_data) {
        switch (true) {
            case (_data == null):
            case (_data == undefined):
            case (isNaN(_data)): {
                return true;
                break;
            }
            default: {
                return false;
                break;
            }
        }
    }

    static replaceNullsWithEmpty(_data) {
        switch (true) {
            case (_data == 'null'):
            case (_data == 'NULL'):
            case (_data == null):
            case (_data == undefined):
            case (_data === ""): {
                return "";
                break;
            }
            default: {
                return _data;
                break;
            }
        }
    }

    static replaceNaNWithZero(_data) {
        switch (true) {
            case (isNaN(_data)): {
                return 0;
                break;
            }
            default: {
                return _data;
                break;
            }
        }
    }

    static StringCompare(value, value2) {
        try {
            let str = StringHelper.replaceNullsWithEmpty(value).toLowerCase();
            let str2 = StringHelper.replaceNullsWithEmpty(value2).toLowerCase();
            return str === str2;
        } catch (ex) {
            console.log(ex);
        }
    }

    static StringIncludes(value, _str) {
        switch (true) {
            case (value == 'null'):
            case (value == 'NULL'):
            case (value == null):
            case (value == undefined):
            case (value === ""): {
                return false;
                break;
            }
            default: {
                value = StringHelper.replaceNullsWithEmpty(value).toLowerCase();
                _str = StringHelper.replaceNullsWithEmpty(_str).toLowerCase();
                return value.includes(_str);
                break;
            }
        }
    }

    static Compare(value, value2) {
        value = StringHelper.replaceNaNWithZero(value);
        return value === value2;
    }

    static Replace(value, _old, _new) {
        try {
            _old = String(_old);
            _new = String(_new);
            value = StringHelper.replaceNullsWithEmpty(String(value)).toLowerCase();
            return value.replace(_old, _new);
        } catch (ex) {
            console.log(ex);
        }
    }

    static InitCap(value) {
        if (!StringHelper.isNull(String(value))) {
            value = value.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
                return m.toUpperCase();
            });
        }
        return value;

    }

}


class UserInputs {
    constructor(data) {
        this.Vehicles = data.Vehicles;
        this.Obits = data.Obits;
        this.WeatherCondition = data.WeatherCondition;
        this.VehicleWeatherCondition = data.VehicleWeatherCondition;
    }
}