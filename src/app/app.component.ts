import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shopping-complex-frontend';
  navBarCollapsed: "collapse"|"" = "collapse";

  toggleNavBar(){
    this.navBarCollapsed = this.navBarCollapsed == "collapse" ? "" : "collapse";
  }
}
