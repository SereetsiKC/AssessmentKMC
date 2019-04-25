

$(document).ready(function () {
    return ModelHelpers.Init();
});
//knocout viewmodel
class ViewModel {
    constructor() {
        this.WConditionOptions = ko.observableArray([]);
        this.WCondition = ko.observable();
        this.ObitOne = ko.observable();
        this.ObitTwo = ko.observable();


        this.Vehicles = ko.observableArray([]);
        this.ValidVehicleCondition = ko.observableArray([]);
        this.Obits = ko.observableArray([]);

        this.displayResult = ko.observable(false);
        this.results = {
            car: ko.observable(),
            Weather: ko.observable(),
            ObitOneSpeedLimit: ko.observable(),
            ObitTwoSpeedLimit: ko.observable(),
            FasterRoute :ko.observable()
        };
        this.WConditionhasError = ko.observable(false);
        this.ObitOnehasError = ko.observable(false);
        this.ObitTwohasError = ko.observable(false);
        this.Submit = this.onSubmit.bind(this);
        this.valid = this._isValid.bind(this);
        this.Render = this.Initialise.bind(this);
    }

    _isValid() {
        this.displayResult(false);
        let valid = true;
        if (StringHelper.isDigitNaN(this.WCondition())) {
            this.WConditionhasError(true);
            valid = false;
        }

        if (StringHelper.isDigitNaN(this.ObitOne())) {
            this.ObitOnehasError(true);
            valid = false;
        }

        if (StringHelper.isDigitNaN(this.ObitTwo())) {
            this.ObitTwohasError(true);
            valid = false;
        }
        return valid;
    }
    async onSubmit() {
        let _valid = this.valid();
        if (_valid) {
            this.WConditionhasError(!_valid);
            this.ObitOnehasError(!_valid);
            this.ObitTwohasError(!_valid);
            this.Obits()[0].SpeedLimit = this.ObitOne();
            this.Obits()[1].SpeedLimit = this.ObitTwo();
            const WeatherCondition = this.WConditionOptions().filter(x => x.id === this.WCondition());
            const VCRelation = this.ValidVehicleCondition().filter(x => x.weatherCondition_Id === this.WCondition());
            const inputs = new UserInputs({
                Vehicles: this.Vehicles(),
                Obits: this.Obits(),
                WeatherCondition: WeatherCondition[0],
                VehicleWeatherCondition: VCRelation
            });
            let response = await Services.calcBestPosibleRoutesPerVehicle(inputs);

            this.results.car(response.Car);
            this.results.Weather(WeatherCondition[0].condition);
            this.results.ObitOneSpeedLimit(this.ObitOne());
            this.results.ObitTwoSpeedLimit(this.ObitTwo());
            this.results.FasterRoute(response.Obit);
            this.displayResult(true);
            console.log(response);
        }
    }

    async Initialise() {
        await ModelHelpers.populateVariables(this);
    }
}

class ModelHelpers {

    static async GetObits() {
        return await new Promise(async (success, error) => {
            try {
                await Services.GetJSONDATA({
                    URL: "../data/obits.json",
                    CALLBACK: async (data) => {
                        console.log(data);
                        return await success(data);
                    },
                    ERROR: async(data) => {
                        console.log(data);
                        return await success([]);
                    }
                });
            } catch (ex) {
                console.log(String(ex));
                return await success([]);
            }
        });
    }

    static async  GetWeatherConditions() {
        return await new Promise(async (success, error) => {
            try {
                Services.GetJSONDATA({
                    URL: "../data/weatherconditions.json",
                    CALLBACK: async(data) => {
                        console.log(data);
                        return await success(data);
                    },
                    ERROR: async (data) => {
                        console.log(data);
                        return await success([]);
                    }
                });
            } catch (ex) {
                console.log(String(ex));
                return await success([]);
            }
        });
    }

    static async GetAllVehicles() {
        return await new Promise(async (success, error) => {
            try {
                Services.GetJSONDATA({
                    URL: "../data/vehicles.json",
                    CALLBACK: async (data) => {
                        console.log(data);
                        return await success(data);
                    },
                    ERROR: async (data) => {
                        console.log(data);
                        return await success([]);
                    }
                });
            } catch (ex) {
                console.log(String(ex));
                return await success([]);
            }
        });
    }

    static async getAllVehiclesWeatherRelationShip() {
        return await new Promise(async (success, error) => {
            try {
                Services.GetJSONDATA({
                    URL: "../data/VehicleWeatherCondition.json",
                    CALLBACK: async (data) => {
                        console.log(data);
                        return await success(data);
                    },
                    ERROR: async (data) => {
                        console.log(data);
                        return await success([]);
                    }
                });
            } catch (ex) {
                console.log(String(ex));
                return await success([]);

            }
        });
    }

    static async populateVariables(object) {
        object.WConditionOptions(await ModelHelpers.GetWeatherConditions());
        object.Obits(await ModelHelpers.GetObits());
        object.Vehicles(await ModelHelpers.GetAllVehicles());
        object.ValidVehicleCondition(await ModelHelpers.getAllVehiclesWeatherRelationShip());

    }

    static Init() {
        let _viewModel = new ViewModel();
        ko.applyBindings(_viewModel, $('.container')[0]);
        _viewModel.Render();
    }
}

