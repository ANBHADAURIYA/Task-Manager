import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios'; 
import { NotificationService } from '../../services/notification/notification.service'; 

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class OverviewComponent implements OnInit {
  tasks = [
    { id: 1, status: 'To Do', count: 5, name: 'Task 1', description: 'Description for Task 1', assignee: 'Anurag Singh', dueDate: '2023-12-01' },
    { id: 2, status: 'In Progress', count: 3, name: 'Task 2', description: 'Description for Task 2', assignee: 'Praveen Kumar', dueDate: '2023-12-05' },
    { id: 3, status: 'Done', count: 2, name: 'Task 3', description: 'Description for Task 3', assignee: 'Amar Tare', dueDate: '2023-12-10' }
  ];

  projects = [
    { name: 'Project A', tasks: 5 },
    { name: 'Project B', tasks: 3 },
    { name: 'Project C', tasks: 2 }
  ];

  summary = {
    todo: 0,
    inProgress: 0,
    done: 0
  };

  taskForm = {
    id: 0,
    name: '',
    status: 'To Do',
    description: '',
    assignee: '',
    dueDate: ''
  };

  isModalOpen = false;
  searchTerm = '';
  selectedStatus = '';
  filteredTasks = this.tasks;
  isAdmin = false;

  constructor(private router: Router, private notificationService: NotificationService) {}

  ngOnInit() {
    this.calculateSummary();
    this.filterTasks(); 
    this.checkAdmin(); 
  }

  checkAdmin() {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
  }

  calculateSummary() {
    this.summary.todo = this.tasks.filter(task => task.status === 'To Do').length;
    this.summary.inProgress = this.tasks.filter(task => task.status === 'In Progress').length;
    this.summary.done = this.tasks.filter(task => task.status === 'Done').length;
  }

  onTaskClick(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.taskForm = { ...task };
      this.isModalOpen = true;
    }
  }

  openModal() {
    this.resetForm();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearchTerm = task.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus ? task.status === this.selectedStatus : true;
      return matchesSearchTerm && matchesStatus;
    });
  }

  async onSubmit() {
    if (this.taskForm.id) {

      const taskIndex = this.tasks.findIndex(task => task.id === this.taskForm.id);
      if (taskIndex !== -1) {
        const oldStatus = this.tasks[taskIndex].status;
        this.tasks[taskIndex] = { ...this.taskForm, count: this.tasks[taskIndex].count };
        if (this.isAdmin && oldStatus !== this.taskForm.status) {
          this.notificationService.notify(`Task "${this.taskForm.name}" status changed to "${this.taskForm.status}".`);
        }
      }
    } else {

      const newTask = {
        ...this.taskForm,
        id: this.tasks.length ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1,
        count: 1 
      };

      try {
        const response = await axios.post('https://790217b8753f4d5a80828967408d562f.api.mockbin.io/', newTask);
        if (response.status === 200) {
          this.tasks.push(newTask);
          alert('Data saved successfully.');
        }
      } catch (error) {
        console.error('Error saving task:', error);
        alert('Failed to save data.');
      }
    }

    this.calculateSummary();
    this.filterTasks(); 
    this.resetForm();
    this.closeModal();
  }

  async deleteTask(taskId: number) {
    try {
      const response = await axios.delete(`https://790217b8753f4d5a80828967408d562f.api.mockbin.io/${taskId}`);
      if (response.status === 200) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.calculateSummary();
        this.filterTasks();
        alert('Task deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  }

  resetForm() {
    this.taskForm = {
      id: 0, 
      name: '',
      status: 'To Do',
      description: '',
      assignee: '',
      dueDate: ''
    };
  }
}
