import tkinter as tk
from tkinter import Toplevel, simpledialog, messagebox
class GUI:
    def __init__(self,currAgents):
        self.currAgents = currAgents
        self.root = tk.Tk()
        self.root.title("Agent Network")

        # Create a Listbox to display a list of agents
        self.agent_listbox = tk.Listbox(self.root)
        for agent in self.currAgents:
            self.agent_listbox.insert(tk.END, agent.name)
        self.agent_listbox.pack()

        # Create a Button to show details of the selected agent
        details_button = tk.Button(self.root, text="Show Details", command=self.show_agent_details)
        details_button.pack()

        # Label for displaying the details (optional, depending on your design)
        self.details_label = tk.Label(self.root, text="Select an agent to view details")
        self.details_label.pack()

    def run(self):
        self.root.mainloop()
    
    def show_agent_details(self):
        selected_index = self.agent_listbox.curselection()
        if selected_index:
            selected_index = selected_index[0]
            selected_agent = self.currAgents[selected_index]
            details = selected_agent.agent_relations
            self.show_details_window(details)

        # selected_agent = currAgents[selected_index]
        # details = selected_agent.agent_relations
        # details_label.config(text=details)
            
    def show_details_window(self, details):
        # Create a new window to display the details
        details_window = Toplevel(self.root)
        details_window.title("Agent Details")

        # Iterate through the details and create a button for each relation
        for name, info in details.items():
            tk.Button(details_window, text=f"Show details for {name}", 
                    command=lambda n=name, i=info: self.show_relation_info(n, i)).pack()

    def show_relation_info(self, name, info):
        # Display the information in a message box or another window
        message = f"Relation with {name}:\nRelation: {info['relation']}\nInteractions: {', '.join(info['interactions'])}"
        messagebox.showinfo(f"Details for {name}", message)
        