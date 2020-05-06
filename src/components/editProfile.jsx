import React from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Form from "./common/form";
import Header from "./header";
import Joi from "joi-browser";
import auth from "../services/authService";
import { toast } from "react-toastify";

class EditProfile extends Form {
  state = {
    data: {
      name: "",
      contact_number: "",
      address: "",
      identity_document: "",
      selfie_document: "",
    },
    errors: {},
    spinnerStatus: false,
  };

  schema = {
    name: Joi.string().required().label("Full Name"),
    contact_number: Joi.string().required().label("Contact Number"),
    address: Joi.string().required().label("Address"),
    identity_document: Joi.any()
      .meta({ swaggerType: "file" })
      .optional()
      .allow("")
      .description("image file"),
    selfie_document: Joi.any()
      .meta({ swaggerType: "file" })
      .optional()
      .allow("")
      .description("image file"),
  };

  async componentDidMount() {
    try {
      this.setState({ spinnerStatus: true });
      const response = await auth.getProfile();

      const { data } = this.state;
      data.name = response.name;
      data.contact_number = response.contact_number;
      data.address = response.address;
      this.setState({ data });
    } catch (ex) {
      if (ex.response) {
        console.log(ex.response.data);
      }
    }
    this.setState({ spinnerStatus: false });
  }

  doSubmit = async () => {
    // const params = { ...data, url, status };
    try {
      this.setState({ spinnerStatus: true });

      const idDoc = document.querySelector("#identity_document");
      const selfieDoc = document.querySelector("#selfie_document");
      console.log("idDoc.files[0]");
      console.log(idDoc.files[0]);

      const { data } = this.state;
      let identity_document;

      if (idDoc.files[0] === undefined) {
        console.log("if");
        // data.identity_document = "";
        identity_document = "";
      } else {
        console.log("else");
        // data.identity_document = idDoc.files[0];
        identity_document = idDoc.files[0];
      }
      // data.identity_document = "";
      console.log("data");
      console.log(data);
      const params = { ...data, identity_document };

      const response = await auth.updateProfile(params);

      // const response = await auth.updateProfile(
      //   data.name,
      //   data.contact_number,
      //   data.address,
      //   idDoc.files[0],
      //   selfieDoc.files[0]
      // );

      /* const formData = new FormData();
      const imagefile = document.querySelector("#identity_document");
      formData.append("identity_document", imagefile.files[0]);
      formData.append("name", data.name);
      formData.append("address", data.address);
      const response = http.post("auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }); */

      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          toast.error(ex.response.data);
        } else if (ex.response.status === 422) {
          // Laravel returns 422 against form validation errors
          const { errors } = ex.response.data;

          for (let item in errors) {
            toast.error(errors[item][0]);
          }
        }
      }
    }
    this.setState({ spinnerStatus: false });
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    // const { name, email, address } = this.state.data;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">User Profile</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        <h5 className="card-text my-2">User Information</h5>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        {this.renderInput("name", "Full Name", "text")}
                      </div>
                      <div className="col-md-6">
                        {this.renderInput(
                          "contact_number",
                          "Contact Number",
                          "text"
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        {this.renderInput("address", "Address", "text")}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        {this.renderFile("identity_document", "ID")}
                      </div>
                      <div className="col-md-6">
                        {this.renderFile("selfie_document", "Selfie with ID")}
                      </div>
                      <div className="col-md-12 text-right">
                        <Link
                          to="/profile"
                          className="btn btn-danger btn-default mr-2"
                        >
                          Cancel
                        </Link>
                        {this.renderButton("Submit", "btn-default")}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditProfile;
