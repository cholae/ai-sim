import tkinter as tk
from tkinter import messagebox

def show_agent_details():
    selected_agent = agent_listbox.get(agent_listbox.curselection())
    # Placeholder for fetching and displaying more detailed information
    # In a real application, you might query a database or another data source
    details = f"Details of {selected_agent}"
    details_label.config(text=details)

# Create the main window
root = tk.Tk()
root.title("Agent Network")

# Create a Listbox to display a list of agents
agent_listbox = tk.Listbox(root)
agent_listbox.insert(1, "Agent 1")
agent_listbox.insert(2, "Agent 2")
agent_listbox.insert(3, "Agent 3")
agent_listbox.pack()

# Create a Button to show details of the selected agent
details_button = tk.Button(root, text="Show Details", command=show_agent_details)
details_button.pack()

# Label for displaying the details
details_label = tk.Label(root, text="Select an agent to view details")
details_label.pack()

# Start the GUI event loop
root.mainloop()
