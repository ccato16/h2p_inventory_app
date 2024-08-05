'use client'
import Image from "next/image"; // added 08/4
import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}



export default function Home() {

  const [inventory, setInventory] = useState([])  // inventory = tracks items 
  const [open, setOpen] = useState(false) // open = whether database is open 
  const [itemName, setItemName] = useState('') // itemName = stores item name 

  // variables for gathering search input and items that match filter
  const [filteredInventory, setFilteredInventory] = useState([])
  const [searchInput, setSearchInput] = useState('')

  // Add this at the beginning with the other useState calls
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation modal




  // Function that updates inventory. 
  // 1. Define anyc function - will peform operations that take some time to complete but will not block code from running 
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []

    //5. Iterate through the document and push doc.id into and other info into the array 
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })

    setInventory(inventoryList)  //6. Update the inventory variable. 
    setFilteredInventory(inventoryList) // Initially, filtered inventory is the same as the full inventory
  }
  

  // React tells app to run updateInventory once app start 
  useEffect(() => {
    updateInventory()
  }, [])


  // Function to add element or item into the database 
  const addItem = async (item) => {
    const normalizedItem = item.toLowerCase().trim();
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem)
    const docSnap = await getDoc(docRef)

    // 3. If the toy exists, increase its quantity by 1 
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } 
    else {
      await setDoc(docRef, { quantity: 1 })
    } 
    await updateInventory()
  }


  const increaseItem = async (item) => {
    const normalizedItem = item.toLowerCase().trim();
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem);
    const docSnap = await getDoc(docRef);
  
    // Increase quantity by 1
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      // If the item does not exist, initialize it with quantity 1
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  }
  

  // Funciton to remove item or element in the database 
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)          // handleOpen: A function to set open to true, like turning on a light or opening a window.
  const handleClose = () => setOpen(false)        //handleClose: A function to set open to false, like turning off a light or closing a window.

  // handleSearch is a function that gathers input from search bar 
  // input is then used to find the items matching in inventory 
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase()
    setSearchInput(searchValue)
    const filteredItems = inventory.filter(item => 
      item.name.toLowerCase().includes(searchValue)
    )
    setFilteredInventory(filteredItems)
  }

  // function to reset search 
  const resetSearch = () => {
    setSearchInput('')
    setFilteredInventory(inventory)
  }

  // Add this function definition
  const emptyInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const batch = writeBatch(firestore); // Make sure to use writeBatch from 'firebase/firestore'
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    await updateInventory(); // Update the inventory list after clearing
  }

  

  return (
      <Box
        width="100vw"
        height="100vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}

        sx={{
          backgroundColor: '#ADD8E6', // Light baby blue background
        }}
      >
        <Box 
          width="1000px"
          sx={{
            border: '2px solid black', // Black outline
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // White background with 80% opacity
            padding: '30px',
            borderRadius: '10px', // Rounds the corners with a radius of 8px

            boxShadow: '5px 5px 0px 0px rgba(0, 0, 0, 1)', // Hard black shadow
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', // Apply rounded corners to the input
              '& fieldset': {
                borderColor: 'black', // Black outline color
              },
              '&:hover fieldset': {
                borderColor: 'black', // Black outline color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black', // Black outline color when focused
              },
            },
            '& .MuiInputLabel-root': {
              color: 'black', // Label color (optional)
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'black', // Label color when focused (optional)
            }
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            gap={2}
          >
            <TextField
              sx={{
                width: '70%',
                borderRadius: '12px', // More rounded corners
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', // Apply rounded corners to the input
                  '& fieldset': {
                    borderColor: 'black', // Black outline color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Black outline color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black', // Black outline color when focused
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'black', // Label color (optional)
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black', // Label color when focused (optional)
                },
              }}
              label="Search Item"
              variant="outlined"
              value={searchInput}
              onChange={handleSearch}
            />
            
            <Modal
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              aria-labelledby="confirmation-modal-title"
              aria-describedby="confirmation-modal-description"
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'white',
                  border: '2px solid black', // Black outline
                  borderRadius: '16px', // Rounded corners
                  boxShadow: '10px 10px 0px 0px rgba(0, 0, 0, 0.8)', // Harsh box shadow
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}

              >
                <Typography id="confirmation-modal-title" variant="h6" component="h2">
                  Confirm Empty Pantry
                </Typography>
                <Typography id="confirmation-modal-description" variant="body1">
                  Are you sure you want to delete all items from the inventory? This action cannot be undone.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={2}>
                  <Button
                    className="button-56"
                    variant="contained"
                    color="error"
                    onClick={async () => {
                      await emptyInventory(); // Clear inventory
                      setConfirmOpen(false); // Close the confirmation modal
                    }}
                  >
                    Yes, Empty
                  </Button>
                  <Button
                    className="button-56"
                    variant="outlined"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Modal>

            <Button 
              className="button-56"
              variant="contained" 
              onClick={() => setConfirmOpen(true)}>
              Empty Pantry
            </Button>


            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'white',
                  border: '2px solid black', // Black outline
                  borderRadius: '16px', // Rounded corners
                  boxShadow: '10px 10px 0px 0px rgba(0, 0, 0, 0.8)', // Harsh box shadow
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Add Item
                </Typography>

                <Stack width="100%" direction={'row'} spacing={2}>
                  <TextField
                    id="outlined-basic"
                    label="Item"
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}

                    sx={{
                      width: '70%',
                      borderRadius: '12px', // More rounded corners
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px', // Apply rounded corners to the input
                        '& fieldset': {
                          borderColor: 'black', // Black outline color
                        },
                        '&:hover fieldset': {
                          borderColor: 'black', // Black outline color on hover
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'black', // Black outline color when focused
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'black', // Label color (optional)
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'black', // Label color when focused (optional)
                      },
                    }}

                  />
                  <Button
                    className="button-56"
                    variant="outlined"
                    onClick={() => {
                      addItem(itemName)
                      setItemName('')
                      handleClose()
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>

            <Button 
              className="button-56"
              variant="contained" 
              onClick={handleOpen}
            >
              Add New Item
            </Button>

          </Box>

          <Box
            width="100%"
            height="100px"
            bgcolor={'#FFFDD0'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            marginTop={2}
            marginBottom={2}
            borderRadius={2}
            sx={{
              border: '2px solid black', // Black outline
              borderRadius: '12px', // More rounded corners
              boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', // Hard black shadow
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px', // Apply rounded corners to the input
                '& fieldset': {
                  borderColor: 'black', // Black outline color
                },
                '&:hover fieldset': {
                  borderColor: 'black', // Black outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black', // Black outline color when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'black', // Label color (optional)
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black', // Label color when focused (optional)
              },
            }}
          >
              <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
                Inventory Items
              </Typography>
          </Box>


          <Box
            width="100%"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#daf0d5'} // Mint Green background
            paddingX={5}
            paddingY={1}
            borderRadius={2}
            marginBottom={2}
            sx={{
              border: '2px solid black', // Black outline
              borderRadius: '12px', // More rounded corners
              boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)', // Hard black shadow
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px', // Apply rounded corners to the input
                '& fieldset': {
                  borderColor: 'black', // Black outline color
                },
                '&:hover fieldset': {
                  borderColor: 'black', // Black outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black', // Black outline color when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'black', // Label color (optional)
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black', // Label color when focused (optional)
              },
            }}
          >
            <Box
              width="30%"
              display={'flex'}
              justifyContent={'flex-start'} 
              alignItems={'center'}
            >
              <Typography variant={'h6'} color={'#333'} textAlign={'left'}>
                Name
              </Typography>
            </Box>

            <Box
              width="30%"
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Typography variant={'h6'} color={'#333'} textAlign={'center'}>
                Quantity
              </Typography>
            </Box>

            <Box
              width="30%"
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}
            >
              <Typography variant={'h6'} color={'#333'} textAlign={'left'}>
                Remove or Add
              </Typography>
            </Box>
          </Box>



          <Stack width="100%" height="300px" spacing={1} overflow={'auto'}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="99.99%"
                minHeight="50px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                paddingX={5}
              >

                <Box
                  width="30%"
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Typography variant={'h6'} color={'#333'} textAlign={'left'} flex={1}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Box>

                <Box
                  width="40%"
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Typography variant={'h6'} color={'#333'}>
                    {quantity}
                  </Typography>
                </Box>

                <Box flex={2} display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    className = "plusOrMinus"
                    variant="contained"
                    onClick={() => removeItem(name)}>
                    -
                  </Button>

                  <Button 
                    className = "plusOrMinus"
                    variant="contained"
                    onClick={() => increaseItem(name)}>
                    +
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
                  



        </Box>
      </Box>
  )
}