const fs = require("fs");
var parse = require("csv-parse");
var _ = require("lodash");

var csvPath = "input.csv";

fs.readFile(csvPath, function(err, fileData) {
  parse(fileData, { columns: false, trim: true }, function(err, rows) {
    const headers = rows[0];

    let emailRowsIndex = rows[0]
      .map((row, index) => {
        return row.includes("email") ? [row, index] : null;
      })
      .filter(val => val);

    let phoneRowsIndex = rows[0]
      .map((row, index) => {
        return row.includes("phone") ? [row, index] : null;
      })
      .filter(val => val);

    let eidIdx = rows[0]
      .map((row, index) => {
        return row.includes("eid") ? [row, index] : null;
      })
      .filter(val => val);

    let fullnameIdx = rows[0]
      .map((row, index) => {
        return row.includes("fullname") ? [row, index] : null;
      })
      .filter(val => val);

    let invisibleIdx = rows[0]
      .map((row, index) => {
        return row.includes("invisible") ? [row, index] : null;
      })
      .filter(val => val);

    let seeAllIdx = rows[0]
      .map((row, index) => {
        return row.includes("see_all") ? [row, index] : null;
      })
      .filter(val => val);

    let classesIndex = rows[0]
      .map((row, index) => {
        return row.includes("classes") ? [row, index] : null;
      })
      .filter(val => val);

    let eids = [];

    let outputIntermediate = rows
      .map(row => {
        let obj = {};
        if (row[fullnameIdx[0][1]] === "fullname") {
          return null;
        }

        eids.includes(rows[eidIdx[0][1]]) ? null : eids.push(row[eidIdx[0][1]]);
        obj[fullnameIdx[0][0]] = row[fullnameIdx[0][1]];
        obj[eidIdx[0][0]] = row[eidIdx[0][1]];
        obj[seeAllIdx[0][0]] = row[seeAllIdx[0][1]];
        obj[invisibleIdx[0][0]] = row[invisibleIdx[0][1]];

        phoneRowsIndex.forEach(phoneRow => {
          obj[phoneRow[0]] = row[phoneRow[1]];
        });

        emailRowsIndex.forEach(emailRow => {
          obj[emailRow[0]] = row[emailRow[1]];
        });

        classesIndex.forEach(classesRow => {
          obj[classesRow[0]] = row[classesRow[1]];
        });

        return obj;
      })
      .filter(val => val)

    let groupedOutput = groupById(outputIntermediate)
   
    let addressesPhones = computeAddressesPhone(groupedOutput, eids, phoneRowsIndex)

    let addressesEmails = computeAddressesEmail(groupedOutput, eids, emailRowsIndex)
  });
});

/* ***********************************************
 *@param rows - csv parsed data rows
 **************************************************/
groupById = function(rows) {
  let groupedClasses = _.groupBy(rows, row => {
    return row["eid"];
  });
  return groupedClasses;
};

/* ***********************************************
 *@param rows - csv parsed data rows
 **************************************************/
computeAddressesPhone = function(groupedRows, eids, phoneRowsIndex) {
  return eids.map(key => {
    return _.reduce(groupedRows[key], (acc, rows) => {
      phoneRowsIndex.forEach((phoneIdx) => {
        if (acc[phoneIdx[0]]) {
          acc[phoneIdx[0]] += rows[phoneIdx[0]] ? rows[phoneIdx[0]] : ''
        } else {
          acc[phoneIdx[0]] = rows[phoneIdx[0]] ? rows[phoneIdx[0]] : ''
        }

        acc[phoneIdx[0]] += ' '
      })
      return acc
    }, {})
  })
}


/* ***********************************************
 *@param rows - csv parsed data rows
 **************************************************/

computeAddressesEmail = function(groupedRows, eids, emailRowsIndex) {
  return eids.map(key => {
    return _.reduce(groupedRows[key], (acc, rows) => {
      emailRowsIndex.forEach((emailIdx) => {
        if (acc[emailIdx[0]]) {
          acc[emailIdx[0]] += rows[emailIdx[0]] ? rows[emailIdx[0]] : ''
        } else {
          acc[emailIdx[0]] = rows[emailIdx[0]] ? rows[emailIdx[0]] : ''
        }

        acc[emailIdx[0]] += ' '
      })
      return acc
    }, {})
  })
}
