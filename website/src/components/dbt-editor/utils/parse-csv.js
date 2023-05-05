import Papa from "papaparse"
import axios from 'axios'

export const parseCsv = async (project, filename) => {
  try {
    const file = await axios(`/dbt_projects/${project}/seeds/${filename}.csv`)
    if(!file?.data) throw new Error('unable to find project data.')
    
    // If user clicks the parse button without
    // a file we show a error
    if (!file) throw new Error("Enter a valid file")

    let csvData = []
    // let csvHeaders
    Papa.parse(file.data, {
      header: false,
      complete: (results) => {
        const { data } = results
        csvData = data
      },
      error: (err) => {
        console.log(err)
      },
    });

    // If data available, return data
    // Otherwise throw error
    if(csvData?.length > 0) {
      return csvData.slice(0, 500)
    } else {
      throw new Error('csvData not found')
    }
  } catch(err) {
    console.log('Unable to parse CSV.', err)
  }
  

}
