import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/register.css";
import data from "../PC-College - Sheet1.json";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

const API_URL = "https://ap-warrior.onrender.com/api/submit";
const genders = ["Male", "Female", "Other"];

AWS.config.update({
  accessKeyId: "AKIAT74AEHFEQGSGLYO6",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new AWS.S3();

function Register() {
  // const generateAWPCode = () =>
  //   `APW-${Math.floor(1000 + Math.random() * 9000)}`;

  const [form, setForm] = useState({
    code: "",
    name: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    district: "",
    university: "",
    // college: "",
    pincode: "",
    image: null,
    documentType: "",
  });

  const [dropdownData, setDropdownData] = useState({
    districts: [],
    universities: [],
    colleges: [],
  });

  const handleDocumentTypeChange = (e) => {
    const selectedDocumentType = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      documentType: selectedDocumentType,
    }));
  };

  const navigate = useNavigate();

  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    const uniqueDistricts = [...new Set(data.map((item) => item["PC Name"]))];
    const uniqueUniversities = [
      ...new Set(data.map((item) => item["Institution Name"])),
    ];

    setDropdownData({
      districts: uniqueDistricts,
      universities: uniqueUniversities,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const phoneNumber =
      name === "phoneNumber" && !value.startsWith("+91")
        ? `+91${value}`
        : value;

    setForm({
      ...form,
      [name]: phoneNumber,
    });
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setForm((prevForm) => ({ ...prevForm, university: selectedValue }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setSelectedDistrict(selectedDistrict);

    const filteredUniversities = data
      .filter((item) => item["PC Name"] === selectedDistrict)
      .map((item) => item["Institution Name"]);

    setDropdownData({
      ...dropdownData,
      universities: [...new Set(filteredUniversities)],
    });
  };

  // const handleUniversityChange = (e) => {
  //   const selectedUniversity = e.target.value;
  //   setSelectedUniversity(selectedUniversity);

  //   const filteredColleges = data
  //     .filter((item) => item["PC Name"] === selectedUniversity)
  //     .map((item) => item["College Name"]);

  //   setDropdownData({
  //     ...dropdownData,
  //     colleges: [...new Set(filteredColleges)],
  //   });
  // };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({
      ...form,
      image: file,
    });
  };

  const handleKeyDown = (e) => {
    const allowedCharacters = /^[0-9\b]+$/;

    if (e.key === "Backspace") {
      const currentValue = e.target.value;

      if (currentValue.endsWith("+91")) {
        e.preventDefault();
        return;
      }

      return;
    }

    if (!allowedCharacters.test(e.key)) {
      e.preventDefault();
    }
    if (e.target.selectionStart === 0 && !/[5-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const uploadImageToS3 = async (file) => {
    const params = {
      Bucket: "ap-warrior",
      Key: `images/${Date.now()}_${file.name}`,
      Body: file,
      ContentType: file.type,
      ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      if (form.documentType) {
        // Only upload image to S3 if a document type is selected
        imageUrl = await uploadImageToS3(form.image);
      }

      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      if (imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Form submitted successfully!");
      setForm({
        code: "",
        name: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        district: "",
        university: "",
        pincode: "",
        image: null,
        documentType: "",
      });
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <>
      <div className="Register" id="register">
        <form className="form-size" onSubmit={handleSubmit}>
          <label>
            AP Warrior code / ఏపీ వారియర్ కోడ్ *
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Name / పేరు *
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Mobile number / మొబైల్ నెంబర్ *
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^\d+]/g, "")
                  .slice(0, 13);
                handleInputChange(e);
              }}
              onKeyDown={handleKeyDown}
              required
            />
          </label>

          <label>
            Date of Birth / పుట్టిన తేది*
            <input
              type="date"
              name="dob"
              value={form.dob}
              max="2010-12-31"
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Gender / లింగం *
            <select
              className="gender"
              name="gender"
              value={form.gender}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </label>
          <br />

          <label>
            PC Name / PC పేరు*
            <select
              className="pc"
              name="district"
              value={form.district}
              onChange={(e) => {
                handleDistrictChange(e);
                handleInputChange(e);
              }}
              required
            >
              <option value="" disabled>
                Select PC Name
              </option>
              {dropdownData.districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                  {/* others */}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Institution Name సంస్థ పేరును ఎంచుకోండి*
            <select
              name="university"
              value={form.university}
              onChange={handleSelectChange}
              required
            >
              <option value="" disabled>
                Select Institution Name
              </option>
              {dropdownData.universities.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
              <option value="new">Enter New Institution Name</option>
            </select>
          </label>
          {form.university === "new" && (
            <div>
              <label>
                New Institution Name
                <input
                  type="text"
                  name="newUniversity"
                  value={form.newUniversity}
                  onChange={handleInputChange}
                  placeholder="Enter new institution name"
                  required
                />
              </label>
            </div>
          )}
          <br />

          <label>
            Pincode / పిన్ కోడ్ *
            <input
              className="pin"
              type="text"
              name="pincode"
              value={form.pincode}
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^\d+]/g, "")
                  .slice(0, 6);
                handleInputChange(e);
              }}
              required
            />
          </label>
          <br />

          <label>
            Document Type / పత్ర ప्रకారం *
            <select
              name="documentType"
              value={form.documentType}
              onChange={handleDocumentTypeChange}
            >
              <option value="" disabled>
                Select Document Type
              </option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="schoolCertificate">School Certificate</option>
            </select>
          </label>
          <br />

          {form.documentType && (
            <div>
              <label>
                Upload Document Proof
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}
          <br />
          <button type="submit">Submit / సమర్పించండి</button>
        </form>
      </div>
      <div className="Main-text">
        <div className="container">
          <h3 className="text1">
            Your vote is more than a choice; it's a voice, a power and a pledge
            for a brighter future of Andhra Pradesh.
          </h3>
        </div>
      </div>
    </>
  );
}

export default Register;
