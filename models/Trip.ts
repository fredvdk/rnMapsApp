export type Trip = {
    id:string,
    destination: string,
    from: Date,
    till: Date,
    hotel: string,
    hotelCost: number,
    transportMode: string,
    transportCost: number,
    latitude:string,
    longitude: string,
    status: string,
    notes: string,
    state: string,
    created: Date,
    updated: Date
}