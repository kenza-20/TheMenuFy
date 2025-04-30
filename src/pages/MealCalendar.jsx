import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import BlurContainer from "../components/blurContainer"
import axios from "axios"

// Meal types with colors and icons
const mealTypes = [
  {
    id: "breakfast",
    name: "Breakfast",
    color: "#e20f0f",
    kcal: "300 - 400 kcal",
    icon: "🍳",
  },
  {
    id: "elevenses",
    name: "Elevenses",
    color: "#157d13",
    kcal: "100 - 200 kcal",
    icon: "🍌",
  },
  {
    id: "lunch",
    name: "Lunch",
    color: "#32a6de",
    kcal: "500 - 700 kcal",
    icon: "🍜",
  },
  {
    id: "dinner",
    name: "Dinner",
    color: "#e29d1d",
    kcal: "400 - 600 kcal",
    icon: "🥙",
  },
  {
    id: "snack",
    name: "Snack",
    color: "#68169c",
    kcal: "100 - 200 kcal",
    icon: "🥨",
  },
]

const MealCalendar = () => {
  const calendarRef = useRef(null)

  // Sample meal data
  const [meals, setMeals] = useState([
    {
      id: "64edcfeb8a690d3d41203dd6",
      title: "Steamed Broccoli",
      calories: 224.72,
      notes: "Protein: 18.27g, Fat: 3.25g, Carbs: 42.12g",
      start: "2023-09-01T11:00:00",
      end: "2023-09-01T12:00:00",
      mealType: "lunch",
      backgroundColor: "#32a6de",
      borderColor: "#32a6de",
      textColor: "#ffffff",
      extendedProps: {
        icon: "🍜",
        calories: 224.72,
      },
    },
    {
      id: "64edcfef8a690d3d41203dd9",
      title: "Broccoli Gratin",
      calories: 815.67,
      notes: "Protein: 50.85g, Fat: 58.52g, Carbs: 27.14g",
      start: "2023-09-01T08:00:00",
      end: "2023-09-01T09:00:00",
      mealType: "breakfast",
      backgroundColor: "#e20f0f",
      borderColor: "#e20f0f",
      textColor: "#ffffff",
      extendedProps: {
        icon: "🍳",
        calories: 815.67,
      },
    },
    {
      id: "64fc819e0306c42d6f08fcd3",
      title: "Jade Broccoli With Pecans",
      calories: 745.71,
      notes: "Protein: 20.59g, Fat: 69.96g, Carbs: 20.10g",
      start: "2023-09-09T08:00:00",
      end: "2023-09-09T09:00:00",
      mealType: "breakfast",
      backgroundColor: "#e20f0f",
      borderColor: "#e20f0f",
      textColor: "#ffffff",
      extendedProps: {
        icon: "🍳",
        calories: 745.71,
      },
    },
    {
      id: "64fc821090046b1b0bd9d922",
      title: "'Salty Oats' Oatmeal Cookies",
      calories: 4412.74,
      notes: "Protein: 65.47g, Fat: 208.29g, Carbs: 598.01g",
      start: "2023-09-09T16:00:00",
      end: "2023-09-09T17:00:00",
      mealType: "snack",
      backgroundColor: "#68169c",
      borderColor: "#68169c",
      textColor: "#ffffff",
      extendedProps: {
        icon: "🥨",
        calories: 4412.74,
      },
    },
  ])

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedMeal, setSelectedMeal] = useState(null)

  // Form state
  const [mealName, setMealName] = useState("")
  const [mealType, setMealType] = useState("breakfast")
  const [calories, setCalories] = useState("")
  const [notes, setNotes] = useState("")
  const [deletedMeal, setDeletedMeal] = useState(null)

  // Load user data from localStorage
  const user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch meals from API
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3000/api/meals/${user}`)
        .then(response => {
          console.log("Fetched meals:", response.data)
  
          const mappedMeals = response.data.map(meal => {
            const type = mealTypes.find(t => t.id === meal.mealType) || mealTypes[0]
            return {
              id: meal._id,
              title: meal.name,
              calories: meal.calories,
              notes: meal.notes,
              start: new Date(meal.date).toISOString(),
              end: new Date(new Date(meal.date).getTime() + 60 * 60 * 1000).toISOString(),
              mealType: meal.mealType,
              backgroundColor: type.color,
              borderColor: type.color,
              textColor: "#ffffff",
              extendedProps: {
                icon: type.icon,
              },
            }
          })
  
          setMeals(mappedMeals)
        })
        .catch(error => {
          console.error('Failed to fetch meals:', error)
        })
    }
  }, [])

  // Handle date click to add a new meal
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr)
    setIsEditMode(false)
    resetForm()
    setIsDialogOpen(true)
  }

  // Handle event click to edit a meal
  const handleEventClick = (info) => {
    const meal = meals.find((m) => m.id === info.event.id)
    if (meal) {
      setSelectedMeal(meal)
      setMealName(meal.title)
      setMealType(meal.mealType)
      setCalories(meal.calories.toString())
      setNotes(meal.notes)
      setIsEditMode(true)
      setIsDialogOpen(true)
    }
  }

  // Handle event drop (drag and drop)
  const handleEventDrop = async (info) => {
    const { event } = info
    const updatedMeal = {
      ...meals.find((m) => m.id === event.id),
      start: event.startStr,
      end: event.endStr || new Date(new Date(event.startStr).getTime() + 60 * 60 * 1000).toISOString(),
    }

    try {
      // Update in local state
      setMeals(meals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)))

      // Uncomment to update on server
      await axios.put(`http://localhost:3000/api/meals/${updatedMeal.id}`, {
        date: new Date(updatedMeal.start)
      })

      toast.success(`${updatedMeal.title} moved to ${new Date(updatedMeal.start).toLocaleDateString()}`)
    } catch (error) {
      console.error("Failed to update meal:", error)
      info.revert()
      toast.error("Failed to update", {
        description: "There was an error updating your meal.",
      })
    }
  }

  // Reset form fields
  const resetForm = () => {
    setMealName("")
    setMealType("breakfast")
    setCalories("")
    setNotes("")
  }

  // Save meal (create or update)
  const handleSaveMeal = async () => {
    if (!mealName.trim()) {
      toast.error("Missing information", {
        description: "Please enter a meal name.",
      })
      return
    }

    const selectedMealType = mealTypes.find((t) => t.id === mealType)

    if (isEditMode && selectedMeal) {
      // Update existing meal
      const updatedMeal = {
        ...selectedMeal,
        title: mealName,
        calories: Number.parseFloat(calories) || 0,
        notes: notes,
        mealType: mealType,
        backgroundColor: selectedMealType.color,
        borderColor: selectedMealType.color,
        extendedProps: {
          icon: selectedMealType.icon,
          calories: Number.parseFloat(calories) || 0,
        },
      }

      try {
        // Update in local state
        setMeals(meals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)))

        await axios.put(`http://localhost:3000/api/meals/${updatedMeal.id}`, {
            idUser: user,
          name: updatedMeal.title,
          calories: updatedMeal.calories,
          notes: updatedMeal.notes,
          mealType: selectedMealType.id
        })

        toast.success("Meal updated", {
          description: `${updatedMeal.title} has been updated.`,
        })
      } catch (error) {
        console.error("Failed to update meal:", error)
        toast.error("Failed to update", {
          description: "There was an error updating your meal.",
        })
      }
    } else {
      // Create new meal
      const startTime = new Date(selectedDate)
      // Set hours based on meal type
      switch (mealType) {
        case "breakfast":
          startTime.setHours(8, 0, 0)
          break
        case "elevenses":
          startTime.setHours(11, 0, 0)
          break
        case "lunch":
          startTime.setHours(13, 0, 0)
          break
        case "dinner":
          startTime.setHours(19, 0, 0)
          break
        case "snack":
          startTime.setHours(16, 0, 0)
          break
        default:
          startTime.setHours(12, 0, 0)
      }

      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 1)

      const newMeal = {
        id: uuidv4(),
        title: mealName,
        calories: Number.parseFloat(calories) || 0,
        notes: notes,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        mealType: mealType,
        backgroundColor: selectedMealType.color,
        borderColor: selectedMealType.color,
        textColor: "#ffffff",
        extendedProps: {
          icon: selectedMealType.icon,
          calories: Number.parseFloat(calories) || 0,
        },
      }

      try {
        // Add to local state
        setMeals([...meals, newMeal])

        // Uncomment to add to server
        const transformedRecipe = {
            userId: user,
          name: newMeal.title,
          notes: newMeal.notes,
          calories: newMeal.calories,
          date: startTime,
          mealType: selectedMealType.id
        }
        try {
          const response = await fetch('http://localhost:3000/api/meals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformedRecipe),
          });
      
          const data = await response.json();
          console.log(data);
        } catch (err) {
          console.error(err);
        }
        toast.success("Meal added", {
          description: `${newMeal.title} has been added to your calendar.`,
        })
      } catch (error) {
        console.error("Failed to add meal:", error)
        toast.error("Failed to add meal", {
          description: "There was an error adding your meal.",
        })
      }
    }

    setIsDialogOpen(false)
  }

  // Delete meal
  const handleDeleteMeal = async () => {
    if (selectedMeal) {
      try {
        // Remove from local state
        setMeals(meals.filter((meal) => meal.id !== selectedMeal.id))
        setDeletedMeal(selectedMeal)

        // Uncomment to delete from server
        await axios.delete(`http://localhost:3000/api/meals/${selectedMeal.id}`)

        toast("Meal deleted", {
          description: `${selectedMeal.title} has been removed.`,
          action: {
            label: "Undo",
            onClick: handleUndoDelete,
          },
        })

        setIsDialogOpen(false)
      } catch (error) {
        console.error("Failed to delete meal:", error)
        toast.error("Failed to delete", {
          description: "There was an error deleting your meal.",
        })
      }
    }
  }

  // Undo delete
  const handleUndoDelete = () => {
    if (deletedMeal) {
      setMeals([...meals, deletedMeal])
      setDeletedMeal(null)
      toast.success("Meal restored", {
        description: `${deletedMeal.title} has been restored to your calendar.`,
      })
    }
  }

  // Custom event rendering
  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo
    const icon = event.extendedProps.icon || "🍽️"

    return (
      <div className="flex items-center p-1 overflow-hidden">
        <span className="mr-1">{icon}</span>
        <div className="flex flex-col overflow-hidden">
          <div className="font-medium truncate">{event.title}</div>
          <div className="text-xs truncate">
            {event.extendedProps.calories ? `${event.extendedProps.calories} kcal` : ""}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Inline styles for the calendar */}
      <style jsx global>{`
        .calendar-container .fc {
          --fc-border-color: rgba(255, 255, 255, 0.2);
          --fc-button-bg-color: rgba(0, 0, 0, 0.3);
          --fc-button-border-color: rgba(255, 255, 255, 0.2);
          --fc-button-hover-bg-color: rgba(0, 0, 0, 0.5);
          --fc-button-hover-border-color: rgba(255, 255, 255, 0.3);
          --fc-button-active-bg-color: #eab308;
          --fc-button-active-border-color: #ca8a04;
          --fc-event-border-color: transparent;
          --fc-event-selected-overlay-color: rgba(255, 255, 255, 0.2);
        }

        .calendar-container .fc-theme-standard .fc-scrollgrid,
        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .calendar-container .fc-daygrid-day-number,
        .calendar-container .fc-col-header-cell-cushion {
          color: white;
        }

        .calendar-container .fc-daygrid-day.fc-day-today {
          background-color: rgba(234, 179, 8, 0.2);
        }

        .calendar-container .fc-button-primary:not(:disabled).fc-button-active,
        .calendar-container .fc-button-primary:not(:disabled):active {
          background-color: #eab308;
          border-color: #ca8a04;
          color: black;
        }

        .calendar-container .fc-button-primary {
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.5rem 0.75rem;
        }

        .calendar-container .fc-toolbar-title {
          color: white;
          font-weight: bold;
        }

        .calendar-container .fc-daygrid-day-frame {
          background-color: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
          border-radius: 0.5rem;
          margin: 2px;
          min-height: 80px;
        }

        .calendar-container .fc-event {
          border-radius: 0.375rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin: 1px 2px;
        }
      `}</style>

      <div className="relative min-h-screen flex flex-col">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
          style={{
            backgroundImage: "url('/bg.jpg')",
            boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
          }}
        />

        {/* Main content */}
        <div className="relative flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
          <div className="w-full max-w-7xl pt-15">
            <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full mx-auto p-6">
              <div className="flex flex-col space-y-10">
                {/* Header Section */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.05}}
                >
                  <h2 className="text-3xl md:text-5xl font-bold text-white">Meal Calendar</h2>
                  <p className="mt-4 text-lg text-white">
                    Plan your meals and track your nutrition with our interactive calendar
                  </p>
                  <motion.div
                    className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 mx-auto rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    animate={{ width: "12rem" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  ></motion.div>
                </motion.div>

                {/* Meal Types Legend */}
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <AnimatePresence>
                    {mealTypes.map((type, index) => (
                      <motion.div
                        key={type.id}
                        className="bg-black/10 backdrop-blur-sm rounded-xl p-3 flex items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2}}
                        whileHover={{ scale: 1.06 }}
                      >
                        <div
                          className="w-6 h-6 rounded-full mr-3 flex items-center justify-center"
                          style={{ backgroundColor: type.color }}
                        >
                          <span>{type.icon}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{type.name}</div>
                          <div className="text-xs text-white/80">{type.kcal}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Calendar */}
                <motion.div
                  className="bg-black/10 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="h-[600px] calendar-container">
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                      }}
                      events={meals}
                      editable={true}
                      selectable={true}
                      selectMirror={true}
                      dayMaxEvents={true}
                      weekends={true}
                      dateClick={handleDateClick}
                      eventClick={handleEventClick}
                      eventDrop={handleEventDrop}
                      eventContent={renderEventContent}
                      height="100%"
                    />
                  </div>
                </motion.div>
              </div>
            </BlurContainer>
          </div>
        </div>

        {/* Add/Edit Meal Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Meal" : "Add New Meal"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="meal-type" className="text-right">
                  Meal Type
                </Label>
                <Select value={mealType} onValueChange={setMealType} className="col-span-3">
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <span className="flex items-center">
                          {type.icon} {type.name} ({type.kcal})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="meal-name" className="text-right">
                  Meal Name
                </Label>
                <Input
                  id="meal-name"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="calories" className="text-right">
                  Calories
                </Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              {isEditMode && (
                <Button variant="destructive" onClick={handleDeleteMeal}>
                  Delete
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMeal} className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default MealCalendar
