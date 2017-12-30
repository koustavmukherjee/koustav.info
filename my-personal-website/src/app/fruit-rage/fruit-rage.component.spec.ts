import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitRageComponent } from './fruit-rage.component';

describe('FruitRageComponent', () => {
  let component: FruitRageComponent;
  let fixture: ComponentFixture<FruitRageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FruitRageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FruitRageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
