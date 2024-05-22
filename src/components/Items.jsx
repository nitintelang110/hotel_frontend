import React,{useState,useEffect} from 'react';
import styles from './Items.module.css';
import axios from 'axios';
import {Link,useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";


export const Items = () => {

const [modal,setModal] = useState(false);
const [itemName,setItemName] = useState('');
const [itemCategory,setItemCategory] = useState('');
const [itemPrice,setItemPrice] = useState(0);
const [item, setItem] = useState([])
const [page, setPage] = useState(10);
const [searchName,setSearchName] = useState(''); 
const [searchCategory, setSearchCategory] = useState('');
  
  const Navigate = useNavigate();

  const itemCode = Math.random() * 1000 + 1;
  const itemCodes = itemCode.toFixed();

    //logic for pagination start
    const [currentPage, setCurrentPage] = useState(1)
    const recordPerPage = page;
    const lastIndex = currentPage * recordPerPage;
    const firstIndex = lastIndex - recordPerPage;
    const items = item.slice(firstIndex, lastIndex);
    const npage = Math.ceil(item.length / recordPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);
     //logic for pagination end

const addItem = () =>{
    setModal(!modal)
    document.body.style.overflowY = 'hidden';
}


  
const handleSubmit = async (e) =>{

  e.preventDefault()

const formData = {
  name:itemName,
  category:itemCategory,
  price:itemPrice,
  code:itemCategory=="VEG"?`VG${itemCodes}`:`NV${itemCodes}`

}

  try {
    await axios.post('http://localhost:8000/api/item/add/item', formData).then((Status) => {
     if (Status) {
       Swal.fire({ position: "center", icon: "success", title: "Submit Successfully!", timer: 1800, showConfirmButton: false });
       Navigate("/items");
       setModal(!modal);
       setItemName('');
       setItemCategory('');
       setItemPrice('')
       location.reload()
     }
  

   })
   
 } catch (error) {
   console.error('Error while sending data:', error);
 } 
  }
  
 useEffect(()=>{

    axios.get("http://localhost:8000/api/item/get/item").then(result => {
    
   
    if (result.data.Status) {

      setItem((result.data.Result))
    }else{
      alert(result.data.Error)
    }

  }).catch(err => console.log(err))
},[])


   const handleDelete = (id) => {
     
    axios.delete("http://localhost:8000/api/item/delete/item/"+id).then(result => {
      if (result.data.Status) {
     
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
              location.reload()
          }
        });

      
      
      } else {
        alert(result.data.Error)
      }
    }
    )
    
    
   }


   const handlePage = (id) => {
  
    setCurrentPage(id + 1)

  }

  const handleNext = () => {
    if (currentPage == npage) {
      alert("This Is Last page")
    } else {
      setCurrentPage(currentPage + 1)
    }
    
  }

  const handlePrev = () => {
         if (currentPage == 1) {
           alert("This Is First page")
    } else {
      setCurrentPage(currentPage - 1)
    }
    
  }


  const createDownLoadData = () => {
    handleExport().then((url) => {
  
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "menu.xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

    const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
      Toast.fire({
    icon:"success",
    title: "Download Successfuly",
    timer:1800
  });
    });
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };

    const wbout = XLSX.write(workbook, wopts);

    // The application/octet-stream MIME type is used for unknown binary files.
    // It preserves the file contents, but requires the receiver to determine file type,
    // for example, from the filename extension.
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });

    return blob;
  };

  const s2ab = (s) => {
    // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
    // create an ArrayBuffer with a size in bytes
    const buf = new ArrayBuffer(s.length);

    //create a 8 bit integer array
    const view = new Uint8Array(buf);

    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; i++) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const handleExport = () => {
    const title = [{ A: "HOTEL PANCHAVATI"},{ B: "HOTEL MENU CART ITEM"}];
       
  
    let table1 = [
      {
       
        A: "Sr. No.",
        B: "Item Name",
        C: "Price",
        D: "Category", 
        
      },
    ];

   
    items.forEach((row,index) => {
      const orderDetails = row;


      table1.push({
        A: index + 1,
        B: orderDetails.item,
        C: orderDetails.price,
        D: orderDetails.category,
       
      });

     
    });


    const finalData = [...title,...table1];

    //create a new workbook
    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, "menu");

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.

    const workbookBlob = workbook2blob(wb);

    var headerIndexes = [];
    finalData.forEach((data, index) =>
      data["B"] === "Item Name" ? headerIndexes.push(index) : null
    );

    const totalRecords = items.length;

    const dataInfo = {
      titleCell: "A1",
      titleRange: "A1:D1",
      tbodyRange: `A1:D${finalData.length}`,
      theadRange:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[0] + 1}:D${headerIndexes[0] + 1}`
          : null,
      tFirstColumnRange:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[0] + 1}:A${totalRecords + headerIndexes[0] + 1}`
          : null,
      tLastColumnRange:
        headerIndexes?.length >= 1
          ? `D${headerIndexes[0] + 1}:D${totalRecords + headerIndexes[0] + 1}`
          : null,

    };

    return addStyle(workbookBlob, dataInfo);
  };

  const addStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: "Arial",
          verticalAlignment: "center",
         
        });

        sheet.column("A").width(10);
        sheet.column("B").width(25);
        sheet.column("C").width(10);
        sheet.column("D").width(15);
       
       

        sheet.range(dataInfo.titleRange).merged(true).style({
          fill: "99CCFF",
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
           border:true
        });
       

        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            horizontalAlignment: "center",
            border: true,
             bold:false
          });
        }

        sheet.range(dataInfo.theadRange).style({
          fill: "99FF99",
          bold: true,
          horizontalAlignment: "center",
          border:true
        });

       

        if (dataInfo.tFirstColumnRange) {
          sheet.range(dataInfo.tFirstColumnRange).style({
            bold: true,
             border:true
          });
        }

        if (dataInfo.tLastColumnRange) {
          sheet.range(dataInfo.tLastColumnRange).style({
            bold: false,
             border:true
          });
        }

      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };




  return (

    <>

   {modal && 
        <div className={styles.modal_container}>
       
          <div className=" d-flex flex-column shadow" id={styles.modal} data-aos="zoom-in">
               <div className='text-right h5 ' onClick={()=>setModal(!modal)}><i class="bi bi-x-circle"></i></div>
         <div className=''>Name</div>
         <input type="text" className="form-control"  name='itemName' value={itemName} onChange={(e)=>setItemName(e.target.value)} required />
        <div className='mt-3'>Category</div>
        <select type='text' className='px-1 rounded-0 form-control' name="itemCategory" value={itemCategory} id=""  onChange={(e)=>setItemCategory(e.target.value)}>
          <option className='' value="Not Given">--Select Category--</option>
          <option className='' value="VEG">VEG</option>
          <option className='' value="NONVEG">NONVEG</option>
        </select>
        <div className='mt-3'>Price</div>
        <input type='number' className="form-control" name='itemPrice' value={itemPrice} onChange={(e)=>setItemPrice(e.target.value)} required />
      
        <button type="submit" className="btn btn-info rounded-0 mt-4" onClick={handleSubmit}>SUBMIT</button>
      </div>
  </div>

   
   }

    <div id={styles.item_container} className='shadow'>
     <div className='bg-info d-flex'>
    
      <div className='w-100 mt-3 mx-5'><h5 className='text-white text-center'>MENU CART ITEM</h5></div>
     </div>


        <div className=' d-flex justify-content-space-around'>


          
<div className='w-25' id={styles.filt}>

<button className='border-1 border-light btn btn-info shadow w-75 mx-3' onClick={addItem} data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Add Item</button>

<button className='border-1 border-light btn btn-info shadow w-75 mx-3 mt-2' onClick={()=>createDownLoadData()}>Download Excel</button>

<select id={styles.pgNo} className='form-control w-75 mx-3 mt-3' value={page} onChange={(e) => setPage(e.target.value )} >
                <option Value={10}>-Select Record-</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                 <option value={item.length}>ALL</option>
          </select>

<select name="searchcategory" id="" className='form-control w-75 mx-3 mt-3' onChange={(e)=>setSearchCategory(e.target.value)}>
  <option value="">-Select Category-</option>
  <option value="VEG">VEG</option>
  <option value="NONVEG">NONVEG</option>
</select>

<input type="text" className='w-75 mx-3 mt-3 form-control' name="searchname" placeholder='Search Name' onChange={(e)=>setSearchName(e.target.value)} id={styles.productName}/> 

</div>



              <table className='table table-bordered w-75 mx-2 mt-3'>
              <thead>
                <tr id={styles.tbl_head_row}>
                <th>
                    Sr.No.
                  </th>
                  <th>
                    Name
                </th>
                  <th>
                    Price (&#8377;)
                </th>
                <th>
                    Category
                </th>
                  <th>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
{items.filter((data)=> searchName === ""? data : data.item.includes(`${searchName.toUpperCase()}`)).filter((data)=> searchCategory === ""? data : data.category === `${searchCategory}`).map((c,id)=>{
  return(<>
<tr key={id}>

  <td className=''>
  {id+1} 
  </td>
  <td >
  {c.item}
      </td>
       <td >
  {c.price}
      </td>
      <td >
  {c.category}
      </td>
  <td >
  <Link to={`/auth/admin/dashboard/editcategory/`+ c.id } className='btn btn-primary btn-sm'>Edit</Link>
  <button className='btn btn-danger btn-sm mx-3' onClick={()=>handleDelete(c.id)}>Delete</button>
  </td>
</tr>
</>
)
})}
              </tbody>
            </table>
          

          
     </div>

   
    
    </div>


    <div className='d-flex flex-row justify-content-space-around bg-info p-2 mb-3' id={styles.footer}>

    <div className='text-left px-3 w-25' >HOTEL FOOD STORE</div>

    <div className={styles.page_numbers_slide} ><div className={styles.page_number}>
      
      <button className={styles.prev} onClick={handlePrev}><i class="bi bi-chevron-left"></i></button>

      {numbers.map((n, ind) => {
        return (
          <div key={ind}>
            <li id={styles.numbers} className={currentPage == n?styles.active_numbers:styles.numbers}  onClick={()=>handlePage(ind)}>{n}</li>
          </div>
       )
     })}
        <button className={styles.next} onClick={handleNext}><i class="bi bi-chevron-right"></i></button>
    </div>
    </div>
    </div>

    



    

    </>
  )
}


