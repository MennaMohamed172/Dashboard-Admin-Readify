import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(
    private userAuthService: UserService,
    private router: Router,
  ){}

  logout() {
    Swal.fire({
      icon: "warning",
      title: `Are you sure you want to log out?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "CANCEL",
      confirmButtonColor: "#8B0000",
      cancelButtonColor: "#ccafaf",
      iconColor: "#8B0000",
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.userAuthService.userLoggedOut();
        this.router.navigate(['/login']);
      }
    });
  }


}
